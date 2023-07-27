import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './create-user-request-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  createUser(@Body() createUser: CreateUserRequest) {}
}
