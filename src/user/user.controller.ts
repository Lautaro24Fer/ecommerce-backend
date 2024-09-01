import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Req,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserPassword } from './dto/update-password-user.dto';
import { UpdateUserPasswordValidate } from './dto/update-user-password-validate.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register succesfull',
    type: User,
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Error creating the new user' 
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All users loaded',
    type: User,
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Error loading all users' 
  })
  @Get()
  async findAll(): Promise<UserDto[]> {
    return await this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get user authenticated by the cookie' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All users loaded',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Bad request, error loading the authenticated user' 
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not founded'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Error loading the authenticated user, unauthoraized exception'
  })
  @UseGuards(AuthGuard)
  @Get('cookie')
  async findOneAuthenticated(@Req() req: Request): Promise<AuthUserResponseDto | undefined> {
    try {
      const responseUser: AuthUserResponseDto = await this.userService.responseByAuthStrategy(req.cookies['user']);
      return responseUser;
    } 
    catch {
      throw new BadRequestException({ error: 'Error getting user authenticated' });
    }
  }

  @ApiOperation({ summary: 'Find one user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User loaded sucessfully',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user was not founded',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Bad request, error loading the user' 
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Can not load the user, unauthorized request'
  })
  // @UseGuards(AuthGuard) -- Elimino las restricciones por testeo
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserDto> {
    return await this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update one user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user was updated succesfully',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user was not founded',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Bad request, error updating the user' 
  })
  @Patch(':id')
  async update( @Param('id') id: number, @Body() updateUserDto: UpdateUserDto ): Promise<UserDto> {
    return await this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user was deleted succesfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation require login',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Unauthorized operation require permises',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user was not founded',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Bad request, error deleting the user' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.userService.remove(id);
  }

  // CAMBIO DE CONTRASEÑA

  @ApiOperation({
		summary: 'Send a code for reset password'
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Mail sended succesfully'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Mail was not sended succesfully'
	})
  @Get('/reset-pass-code')
  async getResetPasswordCode(@Body() updateUserPassword: UpdateUserPassword){
    const user: User = await this.userService.resetPasswordRequest(updateUserPassword.email);
    return user;
  }

  @ApiOperation({
    summary: 'Validation of the code passed by email for update password'
  })
  @ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Code validated succesfully'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Error validating code'
	})
  @Get('/reset-pass-validate-code')
  async validateResetPasswordCode(@Body() updateUserPasswordValidate: UpdateUserPasswordValidate, @Res() res: Response){
    const jwt: string = await this.userService.validatePasswordResetCode(updateUserPasswordValidate.code, updateUserPasswordValidate.email);
    res.cookie('password-reset', jwt, {
      maxAge: 1000 * 60 * 5, 
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
    return res.status(201).json({ status: true, message: 'Code verified succesfully' });
  }

  // Endpoint que requiere de la logica para el cambio de contraseña final
  // Requiere la validación de la cookie temporal que permite el cambio de contraseña durante 5 minutos
  // ya sea dentro de un guard o en el servicio (mejor el guard)
  @Patch('reset-pass')
  async resetPassword(){

  }
}
