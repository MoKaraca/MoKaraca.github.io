import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, Query } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BorrowStatus } from '@prisma/client';

@Controller('borrows')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Get('my')
  findMyBorrows(@Request() req: any) {
    return this.borrowsService.findMyBorrows(req.user.id);
  }

  @Post(':bookId')
  borrowBook(@Param('bookId') bookId: string, @Request() req: any) {
    return this.borrowsService.borrowBook(req.user.id, bookId);
  }

  @Post(':id/return')
  returnBook(@Param('id') id: string, @Request() req: any) {
    return this.borrowsService.returnBook(req.user.id, id);
  }

  @Post(':id/extend')
  extendBorrow(@Param('id') id: string, @Request() req: any, @Body() data: { reason?: string }) {
    return this.borrowsService.requestExtension(req.user.id, id, data.reason);
  }

  @Roles('ADMIN')
  @Get()
  findAll(@Query('status') status?: BorrowStatus) {
    return this.borrowsService.findAll({ status });
  }

  @Roles('ADMIN')
  @Patch(':id/approve')
  approveBorrowRequest(@Param('id') id: string) {
    return this.borrowsService.approveBorrowRequest(id);
  }

  @Roles('ADMIN')
  @Patch(':id/reject')
  rejectBorrowRequest(@Param('id') id: string) {
    return this.borrowsService.rejectBorrowRequest(id);
  }
}
