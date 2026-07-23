import { BookmarksService } from './bookmarks.service';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    getMyBookmarks(req: any): Promise<{
        bookmarkId: string;
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            nameAr: string | null;
            nameTr: string | null;
            slug: string;
            icon: string | null;
            color: string | null;
        };
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
    }[]>;
    addBookmark(bookId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        bookId: string;
        userId: string;
        pageNumber: number;
        label: string | null;
    }>;
    removeBookmark(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        bookId: string;
        userId: string;
        pageNumber: number;
        label: string | null;
    }>;
}
