import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { UsersRepository } from 'src/auth/users.repository';
import { FilterUserDto } from './dto/user-filter.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UsersRepository) {}

  createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  createAdminUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createAdminUser(authCredentialsDto);
  }

  getUsers(filterDto: FilterUserDto): Promise<User[]> {
    return this.userRepository.getUsers(filterDto);
  }

  getUserById(id: string): Promise<User> {
    return this.userRepository.getUserById(id);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    this.userRepository.remove(user);
  }
}
