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

@Controller('orders')
@UseGuards(AuthGuard())
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  getOrderById(
    @Param() productIdParam: GetOneResourceParamDto,
  ): Promise<Order> {
    const { id } = productIdParam;
    return this.orderService.getOrderById(id);
  }

  // @Patch(':id')
  // updateOrderById(
  //   @Param() productIdParam: GetOneResourceParamDto,
  //   @Body() updateOrderDto: UpdateOrderDto,
  // ): Promise<Order> {
  //   const { id } = productIdParam;
  //   return this.orderService.updateOrder(id, updateOrderDto);
  // }

  @Post(':id/pay')
  payOrder(@Param() productIdParam: GetOneResourceParamDto): Promise<Order> {
    const { id } = productIdParam;
    return this.orderService.payOrder(id);
  }

  @Delete(':id')
  deleteOrderById(
    @Param() productIdParam: GetOneResourceParamDto,
  ): Promise<void> {
    const { id } = productIdParam;
    return this.orderService.deleteOrderById(id);
  }
}
