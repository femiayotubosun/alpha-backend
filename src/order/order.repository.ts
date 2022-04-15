import { BadRequestException, NotFoundException } from '@nestjs/common';
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
  async createOrder(user: User): Promise<Order> {
    const order = this.create({
      user,
    });

    return await this.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.find();
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.findOne({
      where: {
        id,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} does not exist`);
    }

    return order;
  }

  async getOrderByUser(user: User): Promise<Order[]> {
    return await this.find({
      where: {
        user,
      },
    });
  }
}
