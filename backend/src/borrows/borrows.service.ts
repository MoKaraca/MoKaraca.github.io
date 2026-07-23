import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, BorrowStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BorrowsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async borrowBook(userId: string, bookId: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      if (user.accountStatus === 'UNDER_PENALTY' || user.accountStatus === 'RESTRICTED' || user.accountStatus === 'SUSPENDED') {
        throw new BadRequestException('Your account is currently restricted from borrowing.');
      }

      // 1. Check availability
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book) throw new NotFoundException('Book not found');
      if (book.availableCopies <= 0) {
        throw new BadRequestException('Book is currently unavailable');
      }

      // 2. Decrement available copies
      await tx.book.update({
        where: { id: bookId },
        data: { availableCopies: book.availableCopies - 1 },
      });

      // 3. Create borrow record (2 days default for pickup request)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 2);

      const record = await tx.borrowRecord.create({
        data: {
          userId,
          bookId,
          dueDate,
          status: BorrowStatus.PENDING,
        },
        include: {
          book: true,
        }
      });

      // Send notification
      await this.notificationsService.notify(
        userId,
        "Borrow Request Submitted",
        `Your request for "${book.title}" has been submitted. Please pick it up within 48 hours once approved.`,
        "SYSTEM"
      );

      return record;
    });
  }

  async findAll(params: { status?: BorrowStatus }) {
    return this.prisma.borrowRecord.findMany({
      where: params.status ? { status: params.status } : undefined,
      include: {
        book: true,
        user: {
          select: { name: true, email: true, id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async approveBorrowRequest(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.borrowRecord.findUnique({
        where: { id },
        include: { book: true }
      });

      if (!record || record.status !== BorrowStatus.PENDING) {
        throw new BadRequestException('Invalid or non-pending borrow request');
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14 days to return once physical handover happens

      const updated = await tx.borrowRecord.update({
        where: { id },
        data: { status: BorrowStatus.ACTIVE, dueDate }
      });

      await this.notificationsService.notify(
        record.userId,
        "Borrow Request Approved",
        `Your request for "${record.book.title}" has been approved! It is now due on ${dueDate.toLocaleDateString()}.`,
        "SYSTEM"
      );

      return updated;
    });
  }

  async rejectBorrowRequest(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.borrowRecord.findUnique({
        where: { id },
        include: { book: true }
      });

      if (!record || record.status !== BorrowStatus.PENDING) {
        throw new BadRequestException('Invalid or non-pending borrow request');
      }

      // Restore available copies
      await tx.book.update({
        where: { id: record.bookId },
        data: { availableCopies: record.book.availableCopies + 1 }
      });

      const updated = await tx.borrowRecord.update({
        where: { id },
        data: { status: BorrowStatus.REJECTED }
      });

      await this.notificationsService.notify(
        record.userId,
        "Borrow Request Rejected",
        `Unfortunately, your request for "${record.book.title}" was rejected or expired.`,
        "SYSTEM"
      );

      return updated;
    });
  }

  async adminReturnBook(adminId: string, borrowRecordId: string) {
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.borrowRecord.findUnique({
        where: { id: borrowRecordId },
        include: { book: true, user: true }
      });
      
      if (!record) {
        throw new NotFoundException('Borrow record not found');
      }
      if (record.status === BorrowStatus.RETURNED) {
        throw new BadRequestException('Book is already returned');
      }

      const now = new Date();
      let isLate = false;
      if (now > record.dueDate) {
        isLate = true;
      }

      // 1. Mark as returned
      const updatedRecord = await tx.borrowRecord.update({
        where: { id: borrowRecordId },
        data: {
          status: BorrowStatus.RETURNED,
          returnedAt: now,
        },
      });

      // 2. Increment available copies
      await tx.book.update({
        where: { id: record.bookId },
        data: { availableCopies: record.book.availableCopies + 1 },
      });

      // 3. Handle Penalties if late
      if (isLate) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        await tx.penalty.create({
          data: {
            userId: record.userId,
            borrowRecordId: record.id,
            reason: 'Late return of book',
            endDate,
          }
        });

        await tx.warning.create({
          data: {
            userId: record.userId,
            borrowRecordId: record.id,
            reason: 'Late return of book',
          }
        });

        const warningsCount = await tx.warning.count({ where: { userId: record.userId } });
        let newStatus = 'UNDER_PENALTY';
        if (warningsCount + 1 >= 3) {
          newStatus = 'RESTRICTED';
        }

        await tx.user.update({
          where: { id: record.userId },
          data: { accountStatus: newStatus as any },
        });

        await this.notificationsService.notify(
          record.userId,
          "Penalty Applied",
          `You returned a book late. A 30-day borrowing penalty has been applied.`,
          "SYSTEM"
        );
      } else {
         await this.notificationsService.notify(
          record.userId,
          "Book Returned",
          `Your return of "${record.book.title}" has been successfully recorded.`,
          "BOOK_RETURNED"
        );
      }

      return updatedRecord;
    });
  }

  async requestExtension(userId: string, borrowRecordId: string, reason?: string) {
    const record = await this.prisma.borrowRecord.findUnique({
      where: { id: borrowRecordId }
    });
    
    if (!record || record.userId !== userId) {
      throw new NotFoundException('Borrow record not found');
    }
    
    // Check if extension already requested
    const existing = await this.prisma.extensionRequest.findFirst({
      where: { borrowRecordId }
    });
    
    if (existing) {
      throw new BadRequestException('Extension already requested for this borrow record');
    }

    const newDueDate = new Date(record.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    return this.prisma.extensionRequest.create({
      data: {
        userId,
        borrowRecordId,
        newDueDate,
        reason,
        status: 'PENDING'
      }
    });
  }

  async findMyBorrows(userId: string) {
    return this.prisma.borrowRecord.findMany({
      where: { userId },
      include: {
        book: true,
        extensions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveExtension(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const req = await tx.extensionRequest.findUnique({
        where: { id },
        include: { borrowRecord: { include: { book: true } } }
      });
      if (!req || req.status !== 'PENDING' || !req.newDueDate) throw new BadRequestException('Invalid extension request');
      
      await tx.extensionRequest.update({
        where: { id },
        data: { status: 'APPROVED' }
      });

      await tx.borrowRecord.update({
        where: { id: req.borrowRecordId },
        data: { dueDate: req.newDueDate, isExtended: true }
      });

      await this.notificationsService.notify(
        req.userId,
        "Extension Approved",
        `Your extension request for "${req.borrowRecord.book.title}" has been approved. New due date is ${req.newDueDate.toLocaleDateString()}.`,
        "EXTENSION_APPROVED"
      );
      return req;
    });
  }

  async rejectExtension(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const req = await tx.extensionRequest.update({
        where: { id },
        data: { status: 'REJECTED' },
        include: { borrowRecord: { include: { book: true } } }
      });

      await this.notificationsService.notify(
        req.userId,
        "Extension Rejected",
        `Your extension request for "${req.borrowRecord.book.title}" was rejected.`,
        "EXTENSION_REJECTED"
      );
      return req;
    });
  }
}
