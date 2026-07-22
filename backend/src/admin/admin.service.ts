import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

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
}
