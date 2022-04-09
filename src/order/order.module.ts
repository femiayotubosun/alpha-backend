import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/auth/users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';
import { ProductRepository } from 'src/product/product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderRepository,
      OrderItemRepository,
      ProductRepository,
      UsersRepository,
    ]),
    AuthModule,
  ],

  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
