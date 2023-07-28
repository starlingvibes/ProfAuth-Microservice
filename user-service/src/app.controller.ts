import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { CreateUserEvent } from './create-user.event';
import { CreateUserRequest } from './create-user.request';
import * as moment from 'moment';
import * as jwt from 'jwt-simple';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './decorators/user.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('register')
  async handleCreateUserRequest(userData) {
    // return this.appService.processCreateUserRequest(data);
    try {
      const user = await this.appService.findByEmail(userData.email);

      if (user) {
        throw new Error('An account with this email already exists');
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }

    const data = await this.appService.processCreateUserRequest(userData);

    // generate JWT token with the user's email and expiration date
    const expires = moment().add(1, 'day').unix();
    const token = jwt.encode(
      {
        email: userData.email,
        expires,
      },
      process.env.JWT_SECRET,
    );

    // const result = new UserEntity(data);

    return {
      status: 'success',
      message: 'User registered successfully',
      data: data,
    };
  }

  @MessagePattern('login')
  async handleUserLoginRequest(userData) {
    try {
      const user = await this.appService.findByEmail(userData.email);

      if (
        !user ||
        !(await this.appService.comparePasswords(user, userData.password))
      ) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const payload = { email: userData.email, role: 'user' };
      const token = this.jwtService.sign(payload);

      return {
        status: 'success',
        message: 'User logged in successfully',
        token,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  @MessagePattern('get_all_users')
  // @UseGuards(AuthGuard('jwt'))
  async handleFetchUsersRequest(data: any, @AuthUser() user: any) {
    try {
      const users = await this.appService.processFetchUsersRequest();

      return {
        status: 'success',
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  @MessagePattern('fetch_single_user')
  async handleFetchUserRequest(data: { id: number }) {
    try {
      const { id } = data;

      const user = await this.appService.processFetchUserRequest(id);

      return {
        status: 'success',
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  @MessagePattern('update_single_user')
  async handleUpdateUserRequest(data: { id: number; [key: string]: any }) {
    // Extract ID and updated data from request
    try {
      const { id, ...updatedUserData } = data;

      const updatedUser = await this.appService.processUpdateUserRequest(
        id,
        updatedUserData,
      );

      return {
        status: 'success',
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  @MessagePattern('delete_single_user')
  async handleDeleteUserRequest(data: { id: number }) {
    try {
      const { id } = data;

      const deletedUser = await this.appService.processDeleteUserRequest(id);

      return {
        status: 'success',
        message: 'User deleted successfully',
        data: deletedUser,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }
}
