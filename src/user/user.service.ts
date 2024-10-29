import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';
import { UserDto } from './dto/user.dto';
import { EmailService } from 'src/email/email.service';
import { IdTypeService } from 'src/id-type/id-type.service';
import { IdType } from 'src/id-type/entities/id-type.entity';
import { AuthUserResponseDto, CreateUserStrategyDto } from './dto/oauth-data';
import { IBadRequestex, INotFoundEx, IRecourseCreated, IRecourseDeleted, IRecourseFound } from 'src/global/responseInterfaces';
import { AddressService } from 'src/address/address.service';
import { Address } from 'src/address/entities/address.entity';

enum UniqueUserRecourse { USERNAME = 'username', EMAIL = 'email'  };
enum SearchParam { ID, USERNAME, EMAIL };

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly roleService: RolesService,
    private readonly emailService: EmailService,
    private readonly idTypeService: IdTypeService,
    private readonly addressService: AddressService
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

    const emailExists = await this.userRepository.existsBy({ email: createUserDto.email }).catch((error) => {
      const response: IBadRequestex = { status: false, message: 'Error in verification if email exists in create user process' };
      console.error(error);
      throw new BadRequestException(response);
    });
    if(emailExists){
      const response: IBadRequestex = { status: false, message: `User with '${createUserDto.email}' already exists` };
      throw new BadRequestException(response);
    }

    const usernameExists = await this.userRepository.existsBy({ username: createUserDto.username.toLowerCase() }).catch((error) => {
      const response: IBadRequestex = { status: false, message: 'Error in verification if username exists un create user process' };
      console.error(error);
      throw new BadRequestException(response);
    });
    if(usernameExists){
      const response: IBadRequestex = { status: false, message: `User with '${createUserDto.username}' already exists` };
      throw new BadRequestException(response);
    }

    createUserDto.password = await this.hashPassword(createUserDto.password);
    createUserDto.username = createUserDto.username.toLocaleLowerCase();

    const idTypeOfUser: IdType = await this.idTypeService.findOne(createUserDto.idType);
    
    const createUser: User = this.userRepository.create({...createUserDto, roles: [], idType: idTypeOfUser });
    const role: Role = await this.roleService.findOneByName('user');
    createUser.roles.push(role);

    const userSaved: User = await this.userRepository.save(createUser);

    const userCreated: User = await this.userRepository.findOne({
      where: { id: userSaved.id},
      relations: ['roles', 'idType', 'address']
    });

    return this.mapUserToUserDto(userCreated);
  }

  async findAll(): Promise<UserDto[]> {

    const users: User[] = await this.userRepository.find({ relations: ['roles', 'idType', 'address'] });
    const usersDto: UserDto[] = users.map((user) => {
      return this.mapUserToUserDto(user);
    });
    return usersDto;
  }

  async findOneByParam(param: string, searchParam: SearchParam): Promise<User | undefined> {
    const userResponse: IRecourseFound = {
      status: true,
      message: 'The user was found succesfully',
      recourse: null
    }
    switch(searchParam){
      case SearchParam.ID:
        let idParsed: number;
        try{
          idParsed = Number(param)
        }
        catch{
          const badRequestError: IBadRequestex = {
            status: false,
            message: 'Can not parse the param arrived to a number'
          }
          throw new BadRequestException(badRequestError);
        }
        const responseId: IRecourseFound = await this.findOneById(idParsed);
        userResponse.recourse = responseId.recourse;
      break;
      case SearchParam.USERNAME:
        const responseUsername: IRecourseFound = await this.findOneByUserName(param);
        userResponse.recourse = responseUsername.recourse;
      break;
      case SearchParam.EMAIL:
        const responseEmail: IRecourseFound = await this.findOneByEmail(param);
        userResponse.recourse = responseEmail.recourse
      break;
      default:
        const badRequestError: IBadRequestex = {
          status: false,
          message: 'The search param is invalid'
        };
        throw new BadRequestException(badRequestError);
      break;
    }
    return userResponse.recourse;
  }

  async findOneById(id: number) {
    const user: User = await this.userRepository.findOne({ where: { id }, relations: ['roles', 'idType', 'address']}).catch((error) => {
      const response: IBadRequestex = { status: false, message: `Error finding the user with id '${id}'` };
      console.error(error);
      throw new BadRequestException(response)
    });
    if (!user) {
      const response: INotFoundEx = { status: false, message: `The user with id '${id}' was not founded` };
      throw new NotFoundException(response);
    }

    const recourseResponse: IRecourseFound = {
      status: true,
      message: 'The user was found succesfully by id',
      recourse: user
    };
    
    return recourseResponse;
  }

  async findOneByUserName(username: string) {

    const user: User = await this.userRepository.findOne({ where: { username }, relations: ['roles', 'idType', 'address'] }).catch((error) => {
      const response: IBadRequestex = { status: false, message: `Error finding the user with username '${username}'` };
      console.error(error);
      throw new BadRequestException(response)
    });
    if (!user) {
      const response: INotFoundEx = { status: false, message: `The user with username '${username}' was not founded` };
      throw new NotFoundException(response);
    }
    const response: IRecourseFound = {
      status: true,
      message: 'The user was found succesfully by username',
      recourse: user
    }
    return response;
  }
  /* Devuelve la entidad completa de usuario (Incluyendo contraseña) */
  async findOneByUsernameEntity(username: string): Promise<User | undefined> {

    const user: User = await this.userRepository.findOne({ where: { username }, relations: ['roles', 'idType', 'address'] }).catch((error) => {
      const response: IBadRequestex = { status: false, message: `Error finding the user with username '${username}'` };
      console.error(error);
      throw new BadRequestException(response)
    });
    if (!user) {
      const response: INotFoundEx = { status: false, message: `The user with username '${username}' was not founded` };
      throw new NotFoundException(response);
    }
    return user;
  }

  async findOneByEmail(email: string) {

    if(!this.validateEmail(email)){
      const badRequestError: IBadRequestex = {
        status: false,
        message: 'The email arrived have a incorrect format'
      };
      throw new BadRequestException(badRequestError);
    }
    const user: User = await this.userRepository.findOne({ where: { email }, relations: ['roles', 'idType', 'address'] }).catch((error) => {
      const response: IBadRequestex = { status: false, message: `Error finding the user with email '${email}'` };
      console.error(error);
      throw new BadRequestException(response)
    })
    if (!user) {
      const response: INotFoundEx = { status: false, message: `The user with email '${email}' was not founded` }
      throw new NotFoundException(response);
    }

    const userResponse: IRecourseFound = {
      status: true,
      message: 'The user was found succesfully by email',
      recourse: user
    }
    return userResponse;
  }

  async findOneByUsernameOrEmail(input: string) {
    
    const isEmail: boolean = await this.validateEmail(input);
    if(isEmail){
      const userByEmail = await this.findOneByParam(input, SearchParam.EMAIL);
      return userByEmail;
    }
    const userByUsername = await this.findOneByParam(input, SearchParam.USERNAME);
    return userByUsername;
  }

  async validateEmail(input: string): Promise<boolean>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(input);
  }

  async findOneByCookie(cookieOnRequest: string) {
    
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
  async validateUserWithStrategy(payload: CreateUserStrategyDto) {

    const user: User = await this.findOneByParam(payload.email, SearchParam.EMAIL);
    if (!user) {
      const role: Role = await this.roleService.findOneByName('user');
      const idType: IdType = await this.idTypeService.findOne(payload.idType);
      const createUser = {
        name: payload.name,
        surname: payload.surname,
        username: payload.username,
        postalCode: payload.postalCode ?? '',
        idNumber: payload.idNumber ?? '',
        email: payload.email,
        method: payload.method,
        roles: [],
        idType: { ...idType },
      };
      createUser.roles.push(role);
      const userCreated: User = await this.userRepository.save(createUser).catch((error) => {
        const response: IBadRequestex = { status: false, message: 'Error in the creation of the user in strategy validation' };
        console.error(error)
        throw new BadRequestException(response);
      });
      return userCreated;
    }
    return user;
  }

  // Verifica si datos unicos como el username o el correo están en uso
  async recourseInUse( input: string, recourseName: UniqueUserRecourse ): Promise<boolean>{

    // La idea de enviar un id de manera opcional es en caso de que se deba obviar la id 
    // para buscar el resto de registros

    let response: boolean;
    switch(recourseName){
      case (UniqueUserRecourse.EMAIL):
        response = await this.userRepository.existsBy({ email: input }).catch((error) => {
          const catchErrorResponse: IBadRequestex = { status: false, message: 'Error in the verification if email exists' };
          console.error(error);
          throw new BadRequestException(catchErrorResponse);
        });
      break;
      case (UniqueUserRecourse.USERNAME):
        response = await this.userRepository.existsBy({ username: input }).catch((error) => {
          const catchErrorResponse: IBadRequestex = { status: false, message: 'Error in the verification if username exists' };
          console.error(error);
          throw new BadRequestException(catchErrorResponse);
        });
      break;
      default:
        const catchErrorResponse: IBadRequestex = { status: false, message: 'Error in the verification if the recourse exists' };
        throw new BadRequestException(catchErrorResponse);
      break;
    }
    return response;
  }

  async update( id: number, updateUserDto: UpdateUserDto ): Promise<UserDto | undefined> {

    const userToUpdate: User = await this.findOneByParam(id.toString(), SearchParam.ID);

    // -- validar que el email está en uso

    if((updateUserDto.email) && (updateUserDto.email !== userToUpdate.email)){
      const userWithSameEmail: boolean = await this.recourseInUse(updateUserDto.email, UniqueUserRecourse.EMAIL);
      if(userWithSameEmail){
        const badRequestError: IBadRequestex = {
          status: false,
          message: `The email '${updateUserDto.email}' is currently in use`,
        }
        throw new BadRequestException(badRequestError);
      }
    }

    // -- validar que el username está en uso

    if((updateUserDto.username) && (updateUserDto.username !== userToUpdate.username)){
      const userWithSameUsername: boolean = await this.recourseInUse(updateUserDto.email, UniqueUserRecourse.USERNAME);
  
      if(userWithSameUsername){
        throw new BadRequestException({ error: `The username '${updateUserDto.username}' is currently in use`});
        
      }
    }
  
    let bodyUpdated: UserDto = { 
      ...userToUpdate, 
      ...updateUserDto,
      address: [],
      idType: userToUpdate.idType
    }

    if(updateUserDto.idType){
      const idTypeOfUser: IdType = await this.idTypeService.findOne(updateUserDto.idType);
      bodyUpdated.idType = idTypeOfUser;
    }

    await this.userRepository.save(userToUpdate);

    return this.mapUserToUserDto(userToUpdate);
  }

  async remove(id: number) {

    const userToRemove = await this.findOneById(id);
    const userRemoved = await this.userRepository.remove(userToRemove);
    const response: IRecourseDeleted = { 
      status: true, 
      message: 'The recourse was deleted succesfully', 
      recourse:  userRemoved
    };
    return response;
  }
  // Manejo de correos
  generateRandomToken(): number { 
		
    // Codigo de un solo uso para poder validar el cambio de contraseña
    return Math.floor(100000 + Math.random() * 900000);
	}
  
  async resetPasswordRequest(input: string){

    const user: User = await this.findOneByUsernameOrEmail(input);

    const expiresIn = new Date(Date.now() + 2 * 60 * 1000); // El codigo de correo durará 2 minutos
		const token = this.generateRandomToken();

    user.passwordResetToken = token.toString(); // el codigo podría hashearse con bcrypt
    user.passwordResetTokenExpiresIn = expiresIn;

    await this.userRepository.save(user);

    await this.emailService.sendEmailForResetPassword(token, user.email); // Envío del correo al usuario con el codigo de cambio de contraseña

    return this.mapUserToUserDto(user);
  }

  async validatePasswordResetCode(code: number, email: string){

    const user: User = await this.findOneByParam(email, SearchParam.EMAIL);

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
      roles: user.roles ?? [],
      surname: user.surname,
      idType: user.idType,
      idNumber: user.idNumber,
      address: user.address ?? []
    };
    return userDto;
  }
}
