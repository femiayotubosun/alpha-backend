import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { PostSubscriber } from './order/order.subcriber';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'alpha-ecommerce-db',
      autoLoadEntities: true,
      synchronize: true,
      subscribers: [PostSubscriber],
    }),
    AuthModule,
    UserModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
