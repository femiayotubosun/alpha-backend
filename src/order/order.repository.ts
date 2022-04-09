import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from 'src/product/product.repository';
import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderItemRepository } from './order-item.repository';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  productRepository: ProductRepository;
  orderItemRepository: OrderItemRepository;

  async createOrder(user: User): Promise<Order> {
    const order = this.create({
      price: 0,
      user,
    });

    return await this.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.find();
  }
}
