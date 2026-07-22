import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsGateway))
    private gateway: NotificationsGateway
  ) {}

  async getMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async markAsRead(userId: string, id: string) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true }
    });
  }

  async notify(userId: string, title: string, message: string, type: 'BORROW_CONFIRMATION' | 'DUE_REMINDER' | 'DUE_TODAY' | 'OVERDUE' | 'EXTENSION_APPROVED' | 'EXTENSION_REJECTED' | 'BOOK_RETURNED' | 'SYSTEM') {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type
      }
    });

    this.gateway.sendNotificationToUser(userId, notification);
    return notification;
  }
}
