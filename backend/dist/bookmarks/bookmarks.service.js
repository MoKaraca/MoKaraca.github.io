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
exports.BookmarksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookmarksService = class BookmarksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyBookmarks(userId) {
        const bookmarks = await this.prisma.bookmark.findMany({
            where: { userId },
            include: {
                book: {
                    include: { category: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return bookmarks.map(b => ({
            ...b.book,
            bookmarkId: b.id,
        }));
    }
    async addBookmark(userId, bookId) {
        const existing = await this.prisma.bookmark.findFirst({
            where: { userId, bookId }
        });
        if (existing) {
            return existing;
        }
        return this.prisma.bookmark.create({
            data: {
                userId,
                bookId,
                pageNumber: 1,
            }
        });
    }
    async removeBookmark(userId, id) {
        const bookmark = await this.prisma.bookmark.findUnique({ where: { id } });
        if (!bookmark || bookmark.userId !== userId) {
            throw new common_1.NotFoundException('Bookmark not found');
        }
        return this.prisma.bookmark.delete({ where: { id } });
    }
};
exports.BookmarksService = BookmarksService;
exports.BookmarksService = BookmarksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookmarksService);
//# sourceMappingURL=bookmarks.service.js.map