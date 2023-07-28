import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { CreateUserEvent } from './create-user.event';
import { CreateUserRequest } from './create-user.request';
import * as moment from 'moment';
import * as jwt from 'jwt-simple';
import { JwtService } from '@nestjs/jwt';

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
    console.log(userData);
    const user = await this.appService.findByEmail(userData.email);

    if (
      !user ||
      !(await this.appService.comparePasswords(user, userData.password))
    ) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: userData.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  @MessagePattern('get_all_users')
  async handleFetchUsersRequest(data: any) {
    const users = await this.appService.processFetchUsersRequest();

    return users;
  }

  @MessagePattern('fetch_single_user')
  async handleFetchUserRequest(data: { id: number }) {
    const { id } = data;

    const user = await this.appService.processFetchUserRequest(id);

    return user;
  }

  @MessagePattern('update_single_user')
  async handleUpdateUserRequest(data: { id: number; [key: string]: any }) {
    // Extract ID and updated data from request
    const { id, ...updatedUserData } = data;

    const updatedUser = await this.appService.processUpdateUserRequest(
      id,
      updatedUserData,
    );

    return updatedUser;
  }

  @MessagePattern('delete_single_user')
  async handleDeleteUserRequest(data: { id: number }) {
    const { id } = data;

    const deletedUser = await this.appService.processDeleteUserRequest(id);

    return deletedUser;
  }
}
