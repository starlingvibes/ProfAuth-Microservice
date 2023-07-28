import { Injectable, Inject } from '@nestjs/common';
import { CreateUserRequest } from './create-user-request-dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {
  private readonly users: any[] = [];

  constructor(
    @Inject('USERS_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createUser(createUserRequest: CreateUserRequest) {
    this.users.push(createUserRequest);
    this.userClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );
  }

  proxyRequest() {
    return this.userClient.send({ cmd: 'proxy_request' }, {});
  }

  proxyCreateUserRequest(createUserRequest: CreateUserRequest) {
    return this.userClient.send({ cmd: 'proxy_post' }, createUserRequest);
  }
}
