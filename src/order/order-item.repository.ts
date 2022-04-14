import { InternalServerErrorException } from '@nestjs/common';
import { Product } from 'src/product/entities/product.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateOrderItemInterface } from './dto/create-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@EntityRepository(OrderItem)
export class OrderItemRepository extends Repository<OrderItem> {
  async createOrderItem(
    createOrderitemInterface: CreateOrderItemInterface,
  ): Promise<OrderItem> {
    const { product, quantity, order } = createOrderitemInterface;

    if (product.stock - quantity < 0) {
      throw new InternalServerErrorException('Not enought stock');
    }
    const orderItem = this.create({
      product,
      quantity,
      order,
    });

    return await this.save(orderItem);
  }

  async getOrderItemsByOrder(order: Order): Promise<OrderItem[]> {
    return await this.find({
      where: {
        order,
      },
    });
  }
}
