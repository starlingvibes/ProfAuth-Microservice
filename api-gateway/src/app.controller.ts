import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  ParseIntPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './create-user-request-dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('USERS_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  createUser(@Body() createUserRequest: CreateUserRequest) {
    return this.appService.createUser(createUserRequest);
  }

  @Get('proxy')
  proxyRequest() {
    return this.appService.proxyRequest();
  }

  @Post('register')
  proxyRegisterPostRequest(@Body() createUserRequest: CreateUserRequest) {
    return this.client
      .send<any, any>('register', createUserRequest)
      .toPromise();
  }

  @Get('users')
  proxyGetUsersRequest() {
    return this.client.send<any, any>('get_all_users', {}).toPromise();
  }

  @Get('users/:id')
  proxyGetUserRequest(@Param('id', ParseIntPipe) id: number) {
    return this.client.send<any, any>('fetch_single_user', { id }).toPromise();
  }

  @Put('users/:id')
  proxyUpdateUserRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedUserData: any,
  ) {
    return this.client
      .send<any, any>('update_single_user', { id, ...updatedUserData })
      .toPromise();
  }

  @Delete('users/:id')
  proxyDeleteUserRequest(@Param('id', ParseIntPipe) id: number) {
    return this.client.send<any, any>('delete_single_user', { id }).toPromise();
  }
}
