import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserEvent } from './create-user.event';
import * as bcrypt from 'bcrypt';

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

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async processCreateUserRequest(userData: User): Promise<User> {
    // return this.usersRepository.create(user);
    // const id = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    userData.password = hashedPassword;

    let setAdmin = false;

    // if (
    //   !userData.token ||
    //   userData.token !== process.env.ADMIN_TOKEN
    // ) {
    //   setAdmin = false;
    // } else {
    //   setAdmin = true;
    // }

    // delete userData.token;

    if (setAdmin) {
      userData.role = 'admin';

      const data = await this.usersRepository.create({
        role: userData.role,
        ...userData,
      });

      return data;
    } else {
      userData.role = 'user';
      const data = await this.usersRepository.create({
        role: userData.role,
        ...userData,
      });

      return data;
    }
  }

  async processFetchUsersRequest(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async processFetchUserRequest(id: number): Promise<User> {
    return this.usersRepository.findByPk(id);
  }

  async processUpdateUserRequest(
    id: number,
    updatedUserData: Partial<User>,
  ): Promise<User | undefined> {
    const user = this.usersRepository.findByPk(id);

    if (!user) {
      return null;
    }

    (await user).update(updatedUserData);

    return user;
  }

  async processDeleteUserRequest(id: number): Promise<number> {
    return this.usersRepository.destroy({ where: { id } });
  }
}
