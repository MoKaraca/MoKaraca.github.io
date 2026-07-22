import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async getMyBookmarks(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        book: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    // Return formatted as just the books for easier frontend parsing, but with the bookmark ID attached
    return bookmarks.map(b => ({
      ...b.book,
      bookmarkId: b.id,
    }));
  }

  async addBookmark(userId: string, bookId: string) {
    const existing = await this.prisma.bookmark.findFirst({
      where: { userId, bookId }
    });
    
    if (existing) {
      return existing; // Idempotent
    }

    return this.prisma.bookmark.create({
      data: {
        userId,
        bookId,
        pageNumber: 1, // Defaulting to 1 for new generic bookmarks
      }
    });
  }

  async removeBookmark(userId: string, id: string) {
    const bookmark = await this.prisma.bookmark.findUnique({ where: { id } });
    if (!bookmark || bookmark.userId !== userId) {
      throw new NotFoundException('Bookmark not found');
    }
    return this.prisma.bookmark.delete({ where: { id } });
  }
}
