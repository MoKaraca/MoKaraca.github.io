import { PrismaService } from '../prisma/prisma.service';
import { BorrowStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
export declare class BorrowsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    borrowBook(userId: string, bookId: string): Promise<{
        book: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isbn: string | null;
            title: string;
            titleAr: string | null;
            titleTr: string | null;
            author: string;
            coverImageUrl: string | null;
            fileUrl: string | null;
            pageCount: number | null;
            publishedYear: number | null;
            publisher: string | null;
            language: string;
            categoryId: string;
            isAvailable: boolean;
            totalCopies: number;
            availableCopies: number;
            keywords: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        borrowedAt: Date;
        dueDate: Date;
        returnedAt: Date | null;
        status: import("@prisma/client").$Enums.BorrowStatus;
        bookId: string;
        userId: string;
    }>;
    findAll(params: {
        status?: BorrowStatus;
    }): Promise<({
        book: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isbn: string | null;
            title: string;
            titleAr: string | null;
            titleTr: string | null;
            author: string;
            coverImageUrl: string | null;
            fileUrl: string | null;
            pageCount: number | null;
            publishedYear: number | null;
            publisher: string | null;
            language: string;
            categoryId: string;
            isAvailable: boolean;
            totalCopies: number;
            availableCopies: number;
            keywords: string[];
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        borrowedAt: Date;
        dueDate: Date;
        returnedAt: Date | null;
        status: import("@prisma/client").$Enums.BorrowStatus;
        bookId: string;
        userId: string;
    })[]>;
    approveBorrowRequest(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        borrowedAt: Date;
        dueDate: Date;
        returnedAt: Date | null;
        status: import("@prisma/client").$Enums.BorrowStatus;
        bookId: string;
        userId: string;
    }>;
    rejectBorrowRequest(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        borrowedAt: Date;
        dueDate: Date;
        returnedAt: Date | null;
        status: import("@prisma/client").$Enums.BorrowStatus;
        bookId: string;
        userId: string;
    }>;
    returnBook(userId: string, borrowRecordId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        borrowedAt: Date;
        dueDate: Date;
        returnedAt: Date | null;
        status: import("@prisma/client").$Enums.BorrowStatus;
        bookId: string;
        userId: string;
    }>;
    requestExtension(userId: string, borrowRecordId: string, reason?: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ExtensionStatus;
        userId: string;
        requestedAt: Date;
        newDueDate: Date | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
        reason: string | null;
        borrowRecordId: string;
    }>;
    findMyBorrows(userId: string): Promise<({
        book: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isbn: string | null;
            title: string;
            titleAr: string | null;
            titleTr: string | null;
            author: string;
            coverImageUrl: string | null;
            fileUrl: string | null;
            pageCount: number | null;
            publishedYear: number | null;
            publisher: string | null;
            language: string;
            categoryId: string;
            isAvailable: boolean;
            totalCopies: number;
            availableCopies: number;
            keywords: string[];
        };
        extensions: {
            id: string;
            status: import("@prisma/client").$Enums.ExtensionStatus;
            userId: string;
            requestedAt: Date;
            newDueDate: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            reason: string | null;
            borrowRecordId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        borrowedAt: Date;
        dueDate: Date;
        returnedAt: Date | null;
        status: import("@prisma/client").$Enums.BorrowStatus;
        bookId: string;
        userId: string;
    })[]>;
}
