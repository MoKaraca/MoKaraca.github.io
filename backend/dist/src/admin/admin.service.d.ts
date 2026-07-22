import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalBooks: number;
        activeBorrows: number;
        totalUsers: number;
        overdueBooks: number;
        borrowTrends: {
            name: string;
            borrows: number;
        }[];
        categoryDistribution: {
            name: string;
            value: number;
        }[];
    }>;
}
