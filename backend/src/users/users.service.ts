import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        penalties: { where: { isActive: true } },
        warnings: true,
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
  }
}
