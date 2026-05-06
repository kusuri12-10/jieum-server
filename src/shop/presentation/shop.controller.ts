import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard.js';
import {
  CurrentUser,
  type JwtPayload,
} from '../../common/decorator/current-user.decorator.js';
import { ShopService } from '../application/shop.service.js';
import { ProductListQueryDto } from '../application/dto/product-list.query.dto.js';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  getProducts(
    @CurrentUser() user: JwtPayload,
    @Query() query: ProductListQueryDto,
  ) {
    return this.shopService.getProducts(user.sub, query);
  }

  @Get(':id')
  getProduct(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.shopService.getProduct(user.sub, id);
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  purchaseProduct(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.shopService.purchaseProduct(user.sub, id);
  }
}
