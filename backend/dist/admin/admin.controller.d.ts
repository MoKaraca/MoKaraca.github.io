import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    updateUserStatus(id: string, body: {
        status: string;
    }): Promise<{
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
    addWarning(id: string, body: {
        reason: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        reason: string;
        borrowRecordId: string | null;
    }>;
    removePenalty(id: string, penaltyId: string): Promise<{
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
