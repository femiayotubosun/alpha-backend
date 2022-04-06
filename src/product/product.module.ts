import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from 'src/auth/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository, UsersRepository]),
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
