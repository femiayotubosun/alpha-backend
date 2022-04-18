import { BadRequestException, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from 'src/auth/users.repository';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository, UsersRepository]),
    AuthModule,
    MulterModule.register({
      dest: './public/photos',
      fileFilter(req, file, callback) {
        const acceptedFormats = ['jpg', 'jpeg', 'png'];
        const splitFilename = file.originalname.split('.');
        const extenstion = splitFilename[splitFilename.length - 1];

        if (!acceptedFormats.includes(extenstion)) {
          callback(
            new BadRequestException('This file format is not accepted'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
