import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
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
    findByEmail(email: string): Promise<{
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
    } | null>;
    create(data: Prisma.UserCreateInput): Promise<{
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
    findProfile(id: string): Promise<({
        notifications: {
            id: string;
            title: string;
            createdAt: Date;
            userId: string;
            type: import("@prisma/client").$Enums.NotificationType;
            message: string;
            isRead: boolean;
            metadata: Prisma.JsonValue | null;
        }[];
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
    }) | null>;
}
