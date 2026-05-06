import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../../common/guard/admin.guard.js';
import { AdminUserService } from '../application/admin-user.service.js';

@Controller('admin/users')
@UseGuards(AdminGuard)
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminUserService.getUser(id);
  }
}
