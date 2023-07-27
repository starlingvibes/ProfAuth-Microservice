import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './create-user-request-dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  createUser(createUserRequest: CreateUserRequest);
}
