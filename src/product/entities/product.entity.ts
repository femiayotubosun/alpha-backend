import { OrderItem } from 'src/order/entities/order-item.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @OneToMany((_type) => OrderItem, (order_item) => order_item.product, {
    eager: false,
  })
  order_items: OrderItem[];
}
