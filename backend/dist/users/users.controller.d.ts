import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<({
        notifications: {
            id: string;
            title: string;
            createdAt: Date;
            userId: string;
            type: import("@prisma/client").$Enums.NotificationType;
            message: string;
            isRead: boolean;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
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
}
