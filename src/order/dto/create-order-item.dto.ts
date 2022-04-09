import { Product } from 'src/product/entities/product.entity';
import { Order } from '../entities/order.entity';

export interface CreateOrderItemInterface {
  product: Product;
  quantity: number;
  order: Order;
}
