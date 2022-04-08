import { Product } from 'src/product/entities/product.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((_type) => Order, (order) => order.items, { eager: false })
  order: Order;

  @ManyToOne((_type) => Product, (product) => product.order_items, {
    eager: false,
  })
  product: Product;

  //   product: Product;

  //   quantity

  // total price
}
