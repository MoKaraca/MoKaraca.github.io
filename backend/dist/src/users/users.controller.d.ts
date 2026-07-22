import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        externalId: string | null;
        email: string;
        password: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    } | null>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        externalId: string | null;
        email: string;
        password: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
