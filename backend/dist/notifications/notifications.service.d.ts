import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: NotificationsGateway);
    getMyNotifications(userId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    markAsRead(userId: string, id: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    notify(userId: string, title: string, message: string, type: 'BORROW_CONFIRMATION' | 'DUE_REMINDER' | 'DUE_TODAY' | 'OVERDUE' | 'EXTENSION_APPROVED' | 'EXTENSION_REJECTED' | 'BOOK_RETURNED' | 'SYSTEM'): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
