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
    getUsers(): Promise<({
        _count: {
            borrowRecords: number;
        };
        penalties: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            reason: string;
            borrowRecordId: string | null;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
        }[];
        warnings: {
            id: string;
            createdAt: Date;
            userId: string;
            reason: string;
            borrowRecordId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        externalId: string | null;
        email: string;
        password: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        accountStatus: import("@prisma/client").$Enums.AccountStatus;
    })[]>;
    updateUserStatus(userId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        externalId: string | null;
        email: string;
        password: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        accountStatus: import("@prisma/client").$Enums.AccountStatus;
    }>;
    addWarning(userId: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        reason: string;
        borrowRecordId: string | null;
    }>;
    removePenalty(userId: string, penaltyId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        reason: string;
        borrowRecordId: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }>;
}
