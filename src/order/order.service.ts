import { Injectable } from '@nestjs/common';
import { copyFileSync } from 'fs';
import { async } from 'rxjs';
import { ProductRepository } from 'src/product/product.repository';
import { User } from 'src/user/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from './entities/order-status.enum';
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

  async getOrderById(id: string): Promise<Order> {
    return await this.orderRepository.getOrderById(id);
  }

  async payOrder(id: string): Promise<Order> {
    const order = await this.getOrderById(id);

    // TODO update oder status
    const updateOrderDto: UpdateOrderDto = {
      status: OrderStatus.APPROVED,
    };
    return await this.updateOrder(order.id, updateOrderDto);
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.getOrderById(id);

    const { price, status } = updateOrderDto;

    if (price) {
      order.price = price;
    }

    if (status) {
      order.status = status;
    }

    return await this.orderRepository.save(order);
  }

  async deleteOrderById(id: string): Promise<void> {
    const order = await this.getOrderById(id);
    const items = await this.orderItemRepository.getOrderItemsByOrder(order);

    items.forEach(async (item: OrderItem) => {
      await this.orderItemRepository.remove(item);
    });

    await this.orderRepository.remove(order);
  }

  async getOrderCharge(id: string): Promise<number> {
    var charge: number = 0;
    const order = await this.orderRepository.getOrderById(id);
    const items = await this.orderItemRepository.getOrderItemsByOrder(order);

    items.forEach(async (item) => {
      charge += item.product.price * item.quantity;
    });

    return await charge;
  }
}
