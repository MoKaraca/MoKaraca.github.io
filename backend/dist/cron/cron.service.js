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
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let CronService = CronService_1 = class CronService {
    prisma;
    notificationsService;
    logger = new common_1.Logger(CronService_1.name);
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async handleDailyTasks() {
        this.logger.debug('Running daily background jobs...');
        await this.checkDueDates();
        await this.autoExpirePenalties();
    }
    async checkDueDates() {
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
                await this.notificationsService.notify(borrow.userId, 'Book Due in 7 Days', `Your borrowed book "${borrow.book.title}" is due in 7 days.`, 'DUE_REMINDER');
            }
            else if (diffDays === 3) {
                await this.notificationsService.notify(borrow.userId, 'Book Due Soon', `Reminder: your borrowed book "${borrow.book.title}" is due in 3 days.`, 'DUE_REMINDER');
            }
            else if (diffDays === 1) {
                await this.notificationsService.notify(borrow.userId, 'Book Due Tomorrow', `Your borrowed book "${borrow.book.title}" must be returned tomorrow.`, 'DUE_REMINDER');
            }
            else if (diffDays === 0) {
                await this.notificationsService.notify(borrow.userId, 'Book Due Today', `Your borrowed book "${borrow.book.title}" must be returned today.`, 'DUE_TODAY');
            }
            else if (diffDays < 0) {
                await this.prisma.borrowRecord.update({
                    where: { id: borrow.id },
                    data: { status: 'OVERDUE' },
                });
                await this.notificationsService.notify(borrow.userId, 'Book Overdue', `Your borrowing period for "${borrow.book.title}" has expired. Please return it immediately.`, 'OVERDUE');
            }
        }
    }
    async autoExpirePenalties() {
        const today = new Date();
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
            const otherPenalties = await this.prisma.penalty.count({
                where: { userId: penalty.userId, isActive: true },
            });
            if (otherPenalties === 0) {
                const warningsCount = await this.prisma.warning.count({
                    where: { userId: penalty.userId },
                });
                if (warningsCount < 3) {
                    await this.prisma.user.update({
                        where: { id: penalty.userId },
                        data: { accountStatus: 'ACTIVE' },
                    });
                    await this.notificationsService.notify(penalty.userId, 'Penalty Expired', 'Your borrowing penalty has expired. You can now borrow books again.', 'SYSTEM');
                }
            }
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "handleDailyTasks", null);
exports.CronService = CronService = CronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], CronService);
//# sourceMappingURL=cron.service.js.map