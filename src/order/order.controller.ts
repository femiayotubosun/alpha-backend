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
    // Get my orders
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  getOrderById(@Param() productIdParam: GetOneResourceParamDto) {
    const { id } = productIdParam;
    return this.orderService.getOrderById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
