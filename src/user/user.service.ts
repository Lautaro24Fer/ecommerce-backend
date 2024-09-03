import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserStrategyDto } from './dto/create-user-strategy.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';
import { UserDto } from './dto/user.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly roleService: RolesService,
    private readonly emailService: EmailService
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(password, salt);
    return hash;
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {

    const emailExists = await this.userRepository.existsBy({ email: createUserDto.email });

    if(emailExists){
      throw new BadRequestException({ error: `User with '${createUserDto.email}' already exists` });
    }

    const usernameExists = await this.userRepository.existsBy({ username: createUserDto.username });

    if(usernameExists){
      throw new BadRequestException({ error: `User with '${createUserDto.username}' already exists` });
    }

    createUserDto.password = await this.hashPassword(createUserDto.password);
    
    const createUser: User = this.userRepository.create({...createUserDto, roles: []});
    const role: Role = await this.roleService.findOneByName('user');
    createUser.roles.push(role);

    const userSaved: User = await this.userRepository.save(createUser);

    const userCreated: User = await this.userRepository.findOne({
      where: { id: userSaved.id},
      relations: ['roles']
    });

    return this.mapUserToUserDto(userCreated);
  }

  async findAll(): Promise<UserDto[]> {
    const users: User[] = await this.userRepository.find({ relations: ['roles'] });
    const usersDto: UserDto[] = users.map((user) => {
      return this.mapUserToUserDto(user);
    });
    return usersDto;
  }

  async findOne(id: number): Promise<UserDto | undefined> {
    const user: User = await this.userRepository.findOne({
      where: { id },
      relations: ['roles']
    });
    if (!user) {
      throw new NotFoundException(`The user with id '${id}' was not founded`);
    }
    return this.mapUserToUserDto(user);
  }

  async findOneByCookie(cookieOnRequest: string) {
    
    // 19/08 23:44
    // No tengo idea porque puse que si no tiene un usuario en la cookie devuelva 
    // el usuario con id 1 
    const userDecoded: any = await this.jwtService.decode(cookieOnRequest);
    const userOnDB: User = await this.userRepository.findOne({
      where: { id: userDecoded.id },
      relations: ['roles']
    });
    if (!userOnDB) {
      throw new NotFoundException({ error: `Error extraing the user with id '${userDecoded.id}', not founded` });
    }
    return userOnDB;
  }

  async responseByAuthStrategy( cookie: string ): Promise<AuthUserResponseDto | undefined> {

    const user: User = await this.findOneByCookie(cookie);
    const userDto: UserDto = this.mapUserToUserDto(user);
    const responseUser: AuthUserResponseDto = { user: userDto, isNewUser: false };
    if (user.username.includes('null')) {
      responseUser.isNewUser = true;
    }
    return responseUser;
  }

  async findOneByUserName(username: string): Promise<UserDto | undefined> {

    const user: User = await this.userRepository.findOne({ 
      where: { username },
      relations: ['roles']
     });
    if (!user) {
      throw new NotFoundException(`The user with username '${username}' was not founded`);
    }
    return this.mapUserToUserDto(user);
  }

  async findOneByUsernameEntity(username: string): Promise<User | undefined> {

    const user: User = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(`The user with username '${username}' was not founded`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDto | undefined> {

    const user: User = await this.userRepository.findOneBy({ email });
    return this.mapUserToUserDto(user);
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

    const user: User = await this.userRepository.findOneBy({ email: payload.email });
    if (!user) {
      const createUser: User = this.userRepository.create({ ...payload, roles: []});
      const role: Role = await this.roleService.findOneByName('user');
      createUser.roles.push(role);
      const userCreated: User = await this.userRepository.save(createUser);
      return userCreated;
    }
    return user;
  }

  async update( id: number, updateUserDto: UpdateUserDto ): Promise<UserDto | undefined> {

    let userToUpdate: User = await this.userRepository.findOne({
      where: { id },
      relations: ['roles']
    });
    if (!userToUpdate) {
      throw new NotFoundException(`The user with id '${id}' was not founded`);
    }

    // -- validar que el email está en uso

    if(updateUserDto.email){
      const userWithSameEmail = await this.userRepository.findOne({
        where: {
          email: updateUserDto.email,
          id: Not(id),
        },
      });
  
      if(userWithSameEmail){
        throw new BadRequestException({ error: `The email '${updateUserDto.email}' is currently in use`});
      }
    }

    // -- validar qu el username está en uso

    if(updateUserDto.username){
      const userWithSameUsername = await this.userRepository.findOne({
        where: {
          username: updateUserDto.username,
          id: Not(id),
        },
      });
  
      if(userWithSameUsername){
        throw new BadRequestException({ error: `The username '${updateUserDto.username}' is currently in use`});
      }
    }

    userToUpdate = { ...userToUpdate, ...updateUserDto};
    await this.userRepository.save(userToUpdate);

    return this.mapUserToUserDto(userToUpdate);
  }

  async remove(id: number): Promise<void> {

    const userToRemove = await this.userRepository.findOneBy({ id });
    if (!userToRemove) {
      throw new NotFoundException(`user with id '${id}' was not founded`);
    }
    await this.userRepository.remove(userToRemove);
  }

  // Manejo de correos

  generateRandomToken(): number { // Codigo de un solo uso para poder validar el cambio de contraseña
		return Math.floor(100000 + Math.random() * 900000);
	}

  /* 
  ACTUALIZACIÓN A FUTURO
  Una mejora sería darle al usuario dos opciones para cuando solicite el cambio de contraseña

  1. Ingresa el correo electronico directamente
  2. Ingresa el nombre de usuario para buscar el correo correspondiente
  */
  async resetPasswordRequest(email: string){

    const user: User = await this.userRepository.findOne({
      where: { email },
      relations: ['roles']
    });

    if(!user){
      throw new NotFoundException({ message: `The user with de email '${email}' was not founded` });
    }

    const expiresIn = new Date(Date.now() + 2 * 60 * 1000); // El codigo de correo durará 2 minutos
		const token = this.generateRandomToken();

    user.passwordResetToken = token.toString(); // el codigo podría hashearse con bcrypt
    user.passwordResetTokenExpiresIn = expiresIn;

    await this.userRepository.save(user);

    await this.emailService.sendEmailForResetPassword(token, email); // Envío del correo al usuario con el codigo de cambio de contraseña

    return this.mapUserToUserDto(user);
  }

  async validatePasswordResetCode(code: number, email: string){

    const user: User = await this.userRepository.findOneBy({ email });
    if(!user){
      throw new NotFoundException({ message: `The user with de email '${email}' was not founded` });
    }

    if(user.passwordResetToken !== code.toString()){
      throw new BadRequestException({ status: false, description: 'The code is incorrect' });
    }

    if(user.passwordResetTokenExpiresIn < new Date()){
      throw new BadRequestException({ status: false, description: 'The code is expired' });
    }

    const jwt: string = await this.jwtService.signAsync({ userId: user.id, isValidOperation: true });
    return jwt;
  }

  async resetPassword(jwt: string, newPassword: string){

    const decoded = await this.jwtService.decode(jwt);

    const user: User = await this.userRepository.findOne({
      where: { id: decoded.userId },
      relations: ['roles']
    });

    if(!user){
      throw new NotFoundException({ message: `The user with the id '${decoded.id}' was not founded` });
    }

    try{

      const newPasswordCrypted: string = await this.hashPassword(newPassword);

      user.password = newPasswordCrypted;

      user.passwordResetToken = null;

      user.passwordResetTokenExpiresIn = null;

      await this.userRepository.save(user);

      return this.mapUserToUserDto(user);
    }
    catch(error){
      console.error(error);
      throw new BadRequestException({ error: 'Error saving the new password' });
    }

  }

  mapUserToUserDto(user: User): UserDto {
    const userDto: UserDto = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      method: user.method,
      roles: user.roles ?? []
    };
    return userDto;
  }
}
