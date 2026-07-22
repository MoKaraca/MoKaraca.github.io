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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const totalBooks = await this.prisma.book.count();
        const activeBorrows = await this.prisma.borrowRecord.count({
            where: { status: { in: ['ACTIVE', 'OVERDUE'] } }
        });
        const totalUsers = await this.prisma.user.count();
        const overdueBooks = await this.prisma.borrowRecord.count({
            where: { status: 'OVERDUE' }
        });
        const categories = await this.prisma.category.findMany({
            include: {
                _count: {
                    select: { books: true }
                }
            }
        });
        const categoryDistribution = categories.map(c => ({
            name: c.name,
            value: c._count.books
        })).filter(c => c.value > 0);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentBorrows = await this.prisma.borrowRecord.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo }
            }
        });
        const borrowTrends = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateString = d.toLocaleDateString('en-US', { weekday: 'short' });
            const count = recentBorrows.filter(b => b.createdAt.toDateString() === d.toDateString()).length;
            return { name: dateString, borrows: count };
        });
        return {
            totalBooks,
            activeBorrows,
            totalUsers,
            overdueBooks,
            borrowTrends,
            categoryDistribution
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map