import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
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
  proxyPostRequest(@Body() createUserRequest: CreateUserRequest) {
    return this.client
      .send<any, any>('register', createUserRequest)
      .toPromise();
  }
}
