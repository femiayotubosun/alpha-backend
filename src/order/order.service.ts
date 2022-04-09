import { Injectable } from '@nestjs/common';
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

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { items } = createOrderDto;
    // Create order
    const order = await this.orderRepository.createOrder(user);

    // Create order Item
    items.forEach(async (item) => {
      // Get product
      let product = await this.productRepository.getProductById(item.id);
      // Create
      let orderitem = await this.orderItemRepository.createOrderItem({
        product,
        quantity: item.quantity,
        order,
      });
    });
  }

  getAllOrders(): Promise<Order[]> {
    return this.orderRepository.getAllOrders();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
