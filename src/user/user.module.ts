import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from 'src/auth/users.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
