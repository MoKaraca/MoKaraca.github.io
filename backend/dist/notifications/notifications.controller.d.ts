import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(req: any): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    markAsRead(id: string, req: any): Promise<{
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
