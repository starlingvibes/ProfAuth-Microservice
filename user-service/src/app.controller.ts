import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { CreateUserEvent } from './create-user.event';
import { CreateUserRequest } from './create-user.request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'proxy_request' }, {})
  proxyRequest() {
    return this.appService.proxyRequest();
  }

  @MessagePattern('register')
  async handleCreatUserRequest(data) {
    return this.appService.processCreateUserRequest(data);
  }
}
