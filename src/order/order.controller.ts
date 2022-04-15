import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/user.entity';
import { GetOneResourceParamDto } from 'src/product/dto/get-one-product.dto';
import { Order } from './entities/order.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/user-roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(AuthGuard())
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.orderService.create(createOrderDto, user);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  // Get my orders

  @Get(':id')
  getOrderById(
    @Param() productIdParam: GetOneResourceParamDto,
  ): Promise<Order> {
    const { id } = productIdParam;
    return this.orderService.getOrderById(id);
  }

  @Delete(':id')
  deleteOrderById(
    @Param() productIdParam: GetOneResourceParamDto,
  ): Promise<void> {
    const { id } = productIdParam;
    return this.orderService.deleteOrderById(id);
  }

  @Get(':id/pay')
  payOrder(
    @Param() productIdParam: GetOneResourceParamDto,
    @GetUser() user: User,
  ) {
    const { id } = productIdParam;
    return this.orderService.payOrder(id, user);
  }

  @Get(':id/verify')
  verifyOrder(
    @Param() productIdParam: GetOneResourceParamDto,
    @GetUser() user: User,
  ) {
    const { id } = productIdParam;
    return this.orderService.verifyOrder(id);
  }
}
