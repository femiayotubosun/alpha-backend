import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/auth/user-roles.enum';
import { GetOneResourceParamDto } from 'src/product/dto/get-one-product.dto';
import { FilterUserDto } from './dto/user-filter.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard(), RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(@Query() filterDto: FilterUserDto): Promise<User[]> {
    return this.userService.getUsers(filterDto);
  }

  @Get(':id')
  getUserById(@Param() userIdParam: GetOneResourceParamDto): Promise<User> {
    const { id } = userIdParam;
    return this.userService.getUserById(id);
  }


  // GET MY ORDERS

  // GET MY DETAILS

  //   TODO: Update User

  @Post()
  createUser(@Body() AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userService.createUser(AuthCredentialsDto);
  }

  @Post('/admin')
  createAdmin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userService.createAdminUser(authCredentialsDto);
  }

  @Delete(':id')
  deleteUserById(@Param() userIdParam: GetOneResourceParamDto): Promise<void> {
    const { id } = userIdParam;
    return this.userService.deleteUser(id);
  }
}
