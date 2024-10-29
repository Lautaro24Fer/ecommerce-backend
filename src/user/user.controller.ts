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
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserDto } from './dto/user.dto';
import { ResetUserPasswordGuard } from './user.guard';
import { AuthUserResponseDto } from './dto/oauth-data';
import { RequestUpdatePasswordCodeDto, ResponsetUpdatePasswordCodeDto, UpdateUserPasswordDto, ValidateUpdateUserPasswordCodeDto } from './dto/password-change';
import { IRecourseFound } from 'src/global/responseInterfaces';

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


  // CAMBIO DE CONTRASEÑA


  @ApiOperation({
		summary: 'Send a email code for validate the identity of the user'
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Mail sended succesfully'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Mail was not sended succesfully'
	})
  @Post('/reset-pass-code')
  async getResetPasswordCode(@Body() updateUserPassword: RequestUpdatePasswordCodeDto){
    const user: User = await this.userService.resetPasswordRequest(updateUserPassword.usernameOrEmail);
    const responseDto: ResponsetUpdatePasswordCodeDto = { status: true, description: 'Code sended succesfully', user}
    return responseDto;  
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
  @Post('/reset-pass-validate-code')
  async validateResetPasswordCode(@Body() updateUserPasswordValidate: ValidateUpdateUserPasswordCodeDto, @Res() res: Response){

    const jwt: string = await this.userService.validatePasswordResetCode(updateUserPasswordValidate.code, updateUserPasswordValidate.email);
    res.cookie('password-reset', jwt, {
      maxAge: 1000 * 60 * 1, // El jwt durará un minuto
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
    const responseDto: ResponsetUpdatePasswordCodeDto = { status: true, description: 'Code verified succesfully' };
    return res.status(201).json(responseDto);
  }



  @ApiOperation({
    summary: 'Once validate, update password by temporally jwt'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password updated succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error updating the password'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Time expired to update password'
  })
  @UseGuards(ResetUserPasswordGuard)
  @Patch('/reset-pass')
  async resetPassword(@Req() req: Request , @Res() res: Response, @Body() updateUserPasswordDto: UpdateUserPasswordDto){

    const jwt: string = req.cookies['password-reset'];

    if(!jwt){
      throw new UnauthorizedException({ error: 'No jwt in request' });
    }

    const userUpdated = await this.userService.resetPassword(jwt, updateUserPasswordDto.newPassword);
    res.cookie('password-reset', '', { httpOnly: true, expires: new Date(0) });
    const responseDto: ResponsetUpdatePasswordCodeDto = { status: true, description: 'Password updated succesfully', user: userUpdated };
    return res.status(201).json(responseDto);
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
  async findOne(@Param('id') id: number): Promise<IRecourseFound> {
    return await this.userService.findOneById(id);
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
    return await this.userService.partialUpdate(id, updateUserDto);
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

}