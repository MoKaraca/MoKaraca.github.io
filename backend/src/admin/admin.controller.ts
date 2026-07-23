import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateUserStatus(id, body.status);
  }

  @Post('users/:id/warnings')
  addWarning(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.addWarning(id, body.reason);
  }

  @Patch('users/:id/penalties/:penaltyId/remove')
  removePenalty(@Param('id') id: string, @Param('penaltyId') penaltyId: string) {
    return this.adminService.removePenalty(id, penaltyId);
  }
}
