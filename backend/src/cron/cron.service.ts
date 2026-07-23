import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyTasks() {
    this.logger.debug('Running daily background jobs...');
    await this.checkDueDates();
    await this.autoExpirePenalties();
  }

  private async checkDueDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBorrows = await this.prisma.borrowRecord.findMany({
      where: { status: 'ACTIVE' },
      include: { user: true, book: true },
    });

    for (const borrow of activeBorrows) {
      const dueDate = new Date(borrow.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 7) {
        await this.notificationsService.notify(
          borrow.userId,
          'Book Due in 7 Days',
          `Your borrowed book "${borrow.book.title}" is due in 7 days.`,
          'DUE_REMINDER'
        );
      } else if (diffDays === 3) {
        await this.notificationsService.notify(
          borrow.userId,
          'Book Due Soon',
          `Reminder: your borrowed book "${borrow.book.title}" is due in 3 days.`,
          'DUE_REMINDER'
        );
      } else if (diffDays === 1) {
        await this.notificationsService.notify(
          borrow.userId,
          'Book Due Tomorrow',
          `Your borrowed book "${borrow.book.title}" must be returned tomorrow.`,
          'DUE_REMINDER'
        );
      } else if (diffDays === 0) {
        await this.notificationsService.notify(
          borrow.userId,
          'Book Due Today',
          `Your borrowed book "${borrow.book.title}" must be returned today.`,
          'DUE_TODAY'
        );
      } else if (diffDays < 0) {
        // Mark as overdue
        await this.prisma.borrowRecord.update({
          where: { id: borrow.id },
          data: { status: 'OVERDUE' },
        });

        await this.notificationsService.notify(
          borrow.userId,
          'Book Overdue',
          `Your borrowing period for "${borrow.book.title}" has expired. Please return it immediately.`,
          'OVERDUE'
        );
      }
    }
  }

  private async autoExpirePenalties() {
    const today = new Date();
    
    // Find all active penalties that have passed their end date
    const expiredPenalties = await this.prisma.penalty.findMany({
      where: {
        isActive: true,
        endDate: { lt: today },
      },
    });

    for (const penalty of expiredPenalties) {
      await this.prisma.penalty.update({
        where: { id: penalty.id },
        data: { isActive: false },
      });

      // Check if user has other active penalties
      const otherPenalties = await this.prisma.penalty.count({
        where: { userId: penalty.userId, isActive: true },
      });

      // If no other penalties, and account is not restricted from warnings, set to active
      if (otherPenalties === 0) {
        const warningsCount = await this.prisma.warning.count({
          where: { userId: penalty.userId },
        });

        if (warningsCount < 3) {
          await this.prisma.user.update({
            where: { id: penalty.userId },
            data: { accountStatus: 'ACTIVE' },
          });

          await this.notificationsService.notify(
            penalty.userId,
            'Penalty Expired',
            'Your borrowing penalty has expired. You can now borrow books again.',
            'SYSTEM'
          );
        }
      }
    }
  }
}
