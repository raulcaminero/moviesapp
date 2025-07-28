import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User | null> {
    await this.usersRepository.update(id, userData);
    return this.getUserById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<{ deleted: boolean }> {
    await this.usersRepository.softDelete(id);
    return { deleted: true };
  }
}