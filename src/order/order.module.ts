import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/auth/users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderRepository,
      OrderItemRepository,
      UsersRepository,
    ]),
    AuthModule,
  ],

  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
