import { PrismaService } from '../prisma/prisma.service';
export declare class BookmarksService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyBookmarks(userId: string): Promise<{
        bookmarkId: string;
        category: {
            id: string;
            name: string;
            slug: string;
            nameAr: string | null;
            nameTr: string | null;
            description: string | null;
            icon: string | null;
            color: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
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
    }[]>;
    addBookmark(userId: string, bookId: string): Promise<{
        id: string;
        createdAt: Date;
        bookId: string;
        userId: string;
        pageNumber: number;
        label: string | null;
    }>;
    removeBookmark(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        bookId: string;
        userId: string;
        pageNumber: number;
        label: string | null;
    }>;
}
