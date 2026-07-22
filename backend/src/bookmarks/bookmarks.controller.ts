import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  getMyBookmarks(@Request() req: any) {
    return this.bookmarksService.getMyBookmarks(req.user.id);
  }

  @Post(':bookId')
  addBookmark(@Param('bookId') bookId: string, @Request() req: any) {
    return this.bookmarksService.addBookmark(req.user.id, bookId);
  }

  @Delete(':id')
  removeBookmark(@Param('id') id: string, @Request() req: any) {
    return this.bookmarksService.removeBookmark(req.user.id, id);
  }
}
