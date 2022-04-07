import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { FilterUserDto } from 'src/user/dto/user-filter.dto';
import { v4 as uuid } from 'uuid';
import { UserRole } from './user-roles.enum';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username alredy exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async createAdminUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username alredy exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUsers(filterDto: FilterUserDto): Promise<User[]> {
    const { search, role } = filterDto;
    const query = this.createQueryBuilder('user');

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (search) {
      query.andWhere('(LOWER(product.name) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });
    }

    const users = await query.getMany();
    return users;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`Product with ID ${id} does not exist.`);
    }

    return user;
  }
}
