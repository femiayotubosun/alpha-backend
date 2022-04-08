import { Exclude } from 'class-transformer';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  @ManyToOne((_type) => User, (user) => user.orders, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @OneToMany((_type) => OrderItem, (order_item) => order_item.order, {
    eager: true,
  })
  items: OrderItem[];
}

/* 

Order Detail


id

order_id

product_id

quantity




*/
