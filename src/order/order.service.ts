import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemRepository: OrderItemRepository,
    private productRepository: ProductRepository,
    private configService: ConfigService,
  ) {}

  config = {
    headers: {
      Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET')}`,
      'Content-Type': 'application/json',
    },
  };

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
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

    return await this.orderRepository.getOrderById(order.id);
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
    if (order.status === OrderStatus.APPROVED) {
      return {
        message: 'You have already paid for this order',
      };
    }

    const orderData = {
      email: user.email,
      amount: String(charge),
    };
    const resp = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      orderData,
      this.config,
    );

    const data = resp.data;
    // console.log(data);
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

    // Check order has been paid for
    if (order.refrence === '') {
      throw new BadRequestException(
        'Something went wrong with the payment of this order',
      );
    }

    // Check if order has already been verified

    if (order.status === OrderStatus.APPROVED) {
      throw new BadRequestException('You have already verified this order');
    }

    // Verify the transaction from paystack

    const resp = await axios.get(
      `https://api.paystack.co/transaction/verify/${order.refrence}`,
      this.config,
    );

    const data = resp.data;

    // Paymenet su

    if (data.data.status === 'success') {
      const updateOrderData = {
        status: OrderStatus.APPROVED,
      };

      var returnData = {
        message: 'Payment successful!',
      };
      await this.updateOrder(order.id, updateOrderData);
      await this.updateOrderItems(order.id);
    } else if (data.data.status === 'failed') {
      const updateOrderData = {
        status: OrderStatus.FAILED,
      };
      var returnData = {
        message: 'Somethig went wrong with your payment.',
      };

      await this.updateOrder(order.id, updateOrderData);
      return;
    } else {
      return {
        message: 'Something went wrong',
      };
    }

    return returnData;
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

  async updateOrderItems(id: string): Promise<void> {
    const order = await this.orderRepository.getOrderById(id);

    order.items.forEach(async (item: OrderItem) => {
      const prod = item.product;
      prod.stock -= item.quantity;
      await this.productRepository.save(prod);
      item.resolved = true;
      await this.orderItemRepository.save(item);
    });
  }
}
