"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowsController = void 0;
const common_1 = require("@nestjs/common");
const borrows_service_1 = require("./borrows.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let BorrowsController = class BorrowsController {
    borrowsService;
    constructor(borrowsService) {
        this.borrowsService = borrowsService;
    }
    findMyBorrows(req) {
        return this.borrowsService.findMyBorrows(req.user.id);
    }
    borrowBook(bookId, req) {
        return this.borrowsService.borrowBook(req.user.id, bookId);
    }
    returnBook(id, req) {
        return this.borrowsService.returnBook(req.user.id, id);
    }
    extendBorrow(id, req, data) {
        return this.borrowsService.requestExtension(req.user.id, id, data.reason);
    }
    findAll(status) {
        return this.borrowsService.findAll({ status });
    }
    approveBorrowRequest(id) {
        return this.borrowsService.approveBorrowRequest(id);
    }
    rejectBorrowRequest(id) {
        return this.borrowsService.rejectBorrowRequest(id);
    }
};
exports.BorrowsController = BorrowsController;
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "findMyBorrows", null);
__decorate([
    (0, common_1.Post)(':bookId'),
    __param(0, (0, common_1.Param)('bookId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "borrowBook", null);
__decorate([
    (0, common_1.Post)(':id/return'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "returnBook", null);
__decorate([
    (0, common_1.Post)(':id/extend'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "extendBorrow", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "approveBorrowRequest", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "rejectBorrowRequest", null);
exports.BorrowsController = BorrowsController = __decorate([
    (0, common_1.Controller)('borrows'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [borrows_service_1.BorrowsService])
], BorrowsController);
//# sourceMappingURL=borrows.controller.js.map