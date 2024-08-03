import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserStrategyDto } from './dto/create-user-strategy.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`The user with id '${id}' was not founded`);
    }
    return user;
  }

  async findOneByCookie(cookieOnRequest: string) {
    const userDecoded: any = await this.jwtService.decode(cookieOnRequest);
    const userOnDB: User = await this.userRepository.findOneBy({
      id: userDecoded?.id ?? 1,
    });
    if (!userOnDB) {
      throw new NotFoundException('user not founded');
    }
    return userOnDB;
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

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user: User = await this.userRepository.findOneBy({ email });
    return user;
  }

  /* IMPORTANTE
  
    Decidí crear un nuevo DTO para la creacion de usuarios en el archivo create-user-strategy.dto.ts 
    en donde creas un usuario con la estrategia (ya sea googleo alguna mas que se pueda añadir en el futuro como facebook
    o discord). ¿Por qué hago esto? Porque como pensarás, al momento de realizar el inicio de sesión con OAuth no
    le vamos a pedir al usuario que ingrese una contraseña. Por lo que decidí crear un nuevo dto para justamente 
    saltear la contraseña. 
    Una cosa importante, yo acá voy a esperar que ingreses también un username que haré único en la DB. Por lo que vas a tener 
    crear una ventana en donde el usuario ingrese un username y luego validaremos en la db si es único
  */

  async validateUserWithStrategy(payload: CreateUserStrategyDto) {
    console.log('__USER GIVEN IN SERVICE__');
    console.log(payload);
    console.log('_________________________');
    const user: User = await this.userRepository.findOneBy({
      email: payload.email,
    });
    if (!user) {
      const userCreated: User = await this.userRepository.save(payload);
      console.log('user created succesfully');
      console.log(userCreated);
      return userCreated;
    }
    console.log('user founded succesfully');
    console.log(user);
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
