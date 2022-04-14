import { Injectable } from '@nestjs/common';
import { copyFileSync } from 'fs';
import { ProductRepository } from 'src/product/product.repository';
import { User } from 'src/user/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItemRepository } from './order-item.repository';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemRepository: OrderItemRepository,
    private productRepository: ProductRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<void> {
    const { items } = createOrderDto;
    // Create order
    var order = await this.orderRepository.createOrder(user);
    // Create order Item

    items.forEach(async (item) => {
      var charge: number = 0;
      // Get product
      let product = await this.productRepository.getProductById(item.id);
      charge = product.price * item.quantity;

      order.price = order.price + charge;
      // Create
      await this.orderItemRepository.createOrderItem({
        product,
        quantity: item.quantity,
        order,
      });

      await this.orderRepository.save(order);
    });
  }

  getAllOrders(): Promise<Order[]> {
    return this.orderRepository.getAllOrders();
  }

  getOrderById(id: string): Promise<Order> {
    return this.orderRepository.getOrderById(id);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
