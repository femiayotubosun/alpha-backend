import { IsNumber, IsOptional } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from './order-status.enum';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @ManyToOne((_type) => Order, (order) => order.items, { eager: false })
  order: Order;

  @ManyToOne((_type) => Product, (product) => product.order_items, {
    eager: true,
  })
  product: Product;
}
