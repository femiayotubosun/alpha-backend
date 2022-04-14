import { IsNumber, IsOptional } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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
    eager: false,
  })
  product: Product;

  // @AfterInsert()
  // generatePrice(): void {
  //   var currentCharge = this.order.price;
  //   var thisCharge = this.product.price * this.quantity;
  //   this.order.price = currentCharge + thisCharge;
  // }
}
