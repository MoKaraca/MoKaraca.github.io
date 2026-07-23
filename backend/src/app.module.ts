import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BorrowsModule } from './borrows/borrows.module';
import { AdminModule } from './admin/admin.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    BooksModule,
    UsersModule,
    AuthModule,
    BorrowsModule,
    AdminModule,
    BookmarksModule,
    NotificationsModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
