"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
let BorrowsService = class BorrowsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async borrowBook(userId, bookId) {
        return this.prisma.$transaction(async (tx) => {
            const book = await tx.book.findUnique({ where: { id: bookId } });
            if (!book)
                throw new common_1.NotFoundException('Book not found');
            if (book.availableCopies <= 0) {
                throw new common_1.BadRequestException('Book is currently unavailable');
            }
            await tx.book.update({
                where: { id: bookId },
                data: { availableCopies: book.availableCopies - 1 },
            });
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 2);
            const record = await tx.borrowRecord.create({
                data: {
                    userId,
                    bookId,
                    dueDate,
                    status: client_1.BorrowStatus.PENDING,
                },
                include: {
                    book: true,
                }
            });
            await this.notificationsService.notify(userId, "Borrow Request Submitted", `Your request for "${book.title}" has been submitted. Please pick it up within 48 hours once approved.`, "SYSTEM");
            return record;
        });
    }
    async findAll(params) {
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
    async approveBorrowRequest(id) {
        return this.prisma.$transaction(async (tx) => {
            const record = await tx.borrowRecord.findUnique({
                where: { id },
                include: { book: true }
            });
            if (!record || record.status !== client_1.BorrowStatus.PENDING) {
                throw new common_1.BadRequestException('Invalid or non-pending borrow request');
            }
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);
            const updated = await tx.borrowRecord.update({
                where: { id },
                data: { status: client_1.BorrowStatus.ACTIVE, dueDate }
            });
            await this.notificationsService.notify(record.userId, "Borrow Request Approved", `Your request for "${record.book.title}" has been approved! It is now due on ${dueDate.toLocaleDateString()}.`, "SYSTEM");
            return updated;
        });
    }
    async rejectBorrowRequest(id) {
        return this.prisma.$transaction(async (tx) => {
            const record = await tx.borrowRecord.findUnique({
                where: { id },
                include: { book: true }
            });
            if (!record || record.status !== client_1.BorrowStatus.PENDING) {
                throw new common_1.BadRequestException('Invalid or non-pending borrow request');
            }
            await tx.book.update({
                where: { id: record.bookId },
                data: { availableCopies: record.book.availableCopies + 1 }
            });
            const updated = await tx.borrowRecord.update({
                where: { id },
                data: { status: client_1.BorrowStatus.REJECTED }
            });
            await this.notificationsService.notify(record.userId, "Borrow Request Rejected", `Unfortunately, your request for "${record.book.title}" was rejected or expired.`, "SYSTEM");
            return updated;
        });
    }
    async returnBook(userId, borrowRecordId) {
        return this.prisma.$transaction(async (tx) => {
            const record = await tx.borrowRecord.findUnique({
                where: { id: borrowRecordId },
                include: { book: true }
            });
            if (!record || record.userId !== userId) {
                throw new common_1.NotFoundException('Borrow record not found');
            }
            if (record.status === client_1.BorrowStatus.RETURNED) {
                throw new common_1.BadRequestException('Book is already returned');
            }
            const updatedRecord = await tx.borrowRecord.update({
                where: { id: borrowRecordId },
                data: {
                    status: client_1.BorrowStatus.RETURNED,
                    returnedAt: new Date(),
                },
            });
            await tx.book.update({
                where: { id: record.bookId },
                data: { availableCopies: record.book.availableCopies + 1 },
            });
            return updatedRecord;
        });
    }
    async requestExtension(userId, borrowRecordId, reason) {
        const record = await this.prisma.borrowRecord.findUnique({
            where: { id: borrowRecordId }
        });
        if (!record || record.userId !== userId) {
            throw new common_1.NotFoundException('Borrow record not found');
        }
        const existing = await this.prisma.extensionRequest.findFirst({
            where: { borrowRecordId }
        });
        if (existing) {
            throw new common_1.BadRequestException('Extension already requested for this borrow record');
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
    async findMyBorrows(userId) {
        return this.prisma.borrowRecord.findMany({
            where: { userId },
            include: {
                book: true,
                extensions: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.BorrowsService = BorrowsService;
exports.BorrowsService = BorrowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], BorrowsService);
//# sourceMappingURL=borrows.service.js.map