import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type User = {
  id: number;
  username: string;
  password: string;
};

@Injectable()
export class UserService {
  private users: User[] = [
    {id: 1, username: 'admin', password: '123456'},
    {id: 2, username: 'user', password: '123456'},
    {id: 3, username: 'guest', password: '123456'},
  ];

  async findOneByUserName(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
