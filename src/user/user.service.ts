import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { UsersRepository } from 'src/auth/users.repository';
import { Order } from 'src/order/entities/order.entity';
import { OrderRepository } from 'src/order/order.repository';
import { FilterUserDto } from './dto/user-filter.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UsersRepository,
    private orderRepository: OrderRepository,
  ) {}

  createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  createAdminUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto, true);
  }

  getUsers(filterDto: FilterUserDto): Promise<User[]> {
    return this.userRepository.getUsers(filterDto);
  }

  getUserById(id: string): Promise<User> {
    return this.userRepository.getUserById(id);
  }

  getUserOrders(user: User): Promise<Order[]> {
    return this.orderRepository.getOrderByUser(user);
  }

  getUserDetails(user: User): Promise<User> {
    console.log(user.id);
    return this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    this.userRepository.remove(user);
  }
}
