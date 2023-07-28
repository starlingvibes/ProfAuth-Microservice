import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {
  constructor(
    // @InjectModel(User) private usersRepository: typeof User
    @Inject('USERS_REPOSITORY') private usersRepository: typeof User,
  ) {}
  private readonly users: any[] = [];

  getHello(): string {
    return 'Hello World!';
  }

  handleUserCreated(data: CreateUserEvent) {
    console.log('User created (user_created): ' + data);
    this.users.push({
      email: data.email,
      timestamp: new Date(),
    });
  }

  proxyRequest() {
    return this.users;
  }

  processCreateUserRequest(data) {
    return data;
  }

  async createUser(user: User): Promise<User> {
    return this.usersRepository.create(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async getUserById(id: number): Promise<User> {
    return this.usersRepository.findByPk(id);
  }

  async deleteUser(id: number): Promise<number> {
    return this.usersRepository.destroy({ where: { id } });
  }
}
