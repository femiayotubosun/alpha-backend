import { BadRequestException, Injectable } from '@nestjs/common';
import { url } from 'inspector';
import { ProductRepository } from 'src/product/product.repository';
import { User } from 'src/user/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaystackDto } from './dto/paystack.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from './entities/order-status.enum';
import { Order } from './entities/order.entity';
import { OrderItemRepository } from './order-item.repository';
import { OrderRepository } from './order.repository';
// import { payWithPaystack } from './payment.service';

const axios = require('axios').default;

const config = {
  headers: {
    Authorization: 'Bearer sk_test_89ab90ebfc20e656e10de4102b41162de0bccfe9',
    'Content-Type': 'application/json',
  },
};

@Injectable()
export class OrderService {
  responseData = {};
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

  async payOrder(id: string, user: User) {
    const order = await this.getOrderById(id);
    const charge = await this.getOrderCharge(order.id);
    const orderData = {
      email: user.email,
      amount: charge,
    };
    const resp = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      orderData,
      config,
    );

    const data = resp.data;
    if (data.status === true) {
      const updateOrderData = {
        reference: data.data.reference,
        status: OrderStatus.PROCESSING,
      };
      await this.updateOrder(order.id, updateOrderData);
      return data;
    } else {
      throw new BadRequestException('Something went wrong');
    }
  }

  async verifyOrder(id: string) {
    const order = await this.getOrderById(id);
    if (order.refrence === '') {
      throw new BadRequestException(
        'Something went wrong with the payment of this order',
      );
    }
    const resp = await axios.get(
      `https://api.paystack.co/transaction/verify/${order.refrence}`,
      config,
    );

    if (resp.data.status === true) {
      const updateOrderData = {
        status: OrderStatus.APPROVED,
      };
      await this.updateOrder(order.id, updateOrderData);

      return {
        message: 'Order has been verified!',
      };
    } else {
      return {
        message: 'Somethig went wrong with your payment.',
      };
    }
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.getOrderById(id);

    const { price, status, reference } = updateOrderDto;

    if (price) {
      order.price = price;
    }

    if (status) {
      order.status = status;
    }

    if (reference) {
      order.refrence = reference;
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
