import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        totalBooks: number;
        activeBorrows: number;
        totalUsers: number;
        overdueBooks: number;
        borrowTrends: {
            name: string;
            borrows: number;
        }[];
        categoryDistribution: {
            name: string;
            value: number;
        }[];
    }>;
}
