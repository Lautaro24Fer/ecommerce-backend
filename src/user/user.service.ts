import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(password, salt);
    return hash;
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto.password);

    await this.userRepository.save(createUserDto);

    const userCreated: User = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    return userCreated;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User | undefined> {
    const user: User = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException(`The user with id '${id}' was not founded`);
    }
    return user;
  }

  async findOneByUserName(username: string): Promise<User | undefined> {
    const user: User = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new NotFoundException(
        `The user with username '${username}' was not founded`,
      );
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    let userToUpdate: User = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!userToUpdate) {
      throw new NotFoundException(`The user with id '${id}' was not founded`);
    }

    if (userToUpdate.password) {
      userToUpdate.password = await this.hashPassword(userToUpdate.password);
    }

    userToUpdate = { ...userToUpdate, ...updateUserDto };
    await this.userRepository.save(userToUpdate);
    return userToUpdate;
  }

  async remove(id: number): Promise<void> {
    const userToRemove = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!userToRemove) {
      throw new NotFoundException(`user with id '${id}' was not founded`);
    }
    await this.userRepository.remove(userToRemove);
  }
}
