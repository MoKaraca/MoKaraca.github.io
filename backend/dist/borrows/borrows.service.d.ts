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
            isbn: string | null;
            title: string;
            titleAr: string | null;
            titleTr: string | null;
            author: string;
            description: string | null;
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
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        borrowedAt: Date;
        dueDate: Date;
        returnedAt: Date | null;
        status: import("@prisma/client").$Enums.BorrowStatus;
        isExtended: boolean;
        bookId: string;
        userId: string;
    }>;
    findAll(params: {
        status?: BorrowStatus;
    }): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        book: {
            id: string;
            isbn: string | null;
            title: string;
            titleAr: string | null;
            titleTr: string | null;
            author: string;
            description: string | null;
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
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        borrowedAt: Date;
        dueDate: Date;
        returnedAt: Date | null;
        status: import("@prisma/client").$Enums.BorrowStatus;
        isExtended: boolean;
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
        isExtended: boolean;
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
        isExtended: boolean;
        bookId: string;
        userId: string;
    }>;
    adminReturnBook(adminId: string, borrowRecordId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        borrowedAt: Date;
        dueDate: Date;
        returnedAt: Date | null;
        status: import("@prisma/client").$Enums.BorrowStatus;
        isExtended: boolean;
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
            isbn: string | null;
            title: string;
            titleAr: string | null;
            titleTr: string | null;
            author: string;
            description: string | null;
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
            createdAt: Date;
            updatedAt: Date;
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
        isExtended: boolean;
        bookId: string;
        userId: string;
    })[]>;
    approveExtension(id: string): Promise<{
        borrowRecord: {
            book: {
                id: string;
                isbn: string | null;
                title: string;
                titleAr: string | null;
                titleTr: string | null;
                author: string;
                description: string | null;
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
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            borrowedAt: Date;
            dueDate: Date;
            returnedAt: Date | null;
            status: import("@prisma/client").$Enums.BorrowStatus;
            isExtended: boolean;
            bookId: string;
            userId: string;
        };
    } & {
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
    rejectExtension(id: string): Promise<{
        borrowRecord: {
            book: {
                id: string;
                isbn: string | null;
                title: string;
                titleAr: string | null;
                titleTr: string | null;
                author: string;
                description: string | null;
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
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            borrowedAt: Date;
            dueDate: Date;
            returnedAt: Date | null;
            status: import("@prisma/client").$Enums.BorrowStatus;
            isExtended: boolean;
            bookId: string;
            userId: string;
        };
    } & {
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
}
