import { Exclude } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/user.entity';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
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

  @ManyToOne((_type) => User, (user) => user.orders, { eager: true })
  user: User;

  @OneToMany((_type) => OrderItem, (order_item) => order_item.order, {
    eager: true,
  })
  items: OrderItem[];

  // @IsNumber()
  // @IsOptional()
  // protected charge: number;

  // @AfterLoad()
  // @AfterInsert()
  // @AfterUpdate()
  // generatePrice(): void {
  //   let charge = 0;
  //   this.items.forEach((item) => {
  //     charge += item.product.price * item.quantity;
  //   });

  //   this.charge = charge
  // }
}

/* 

Order Detail


id

order_id

product_id

quantity




*/
