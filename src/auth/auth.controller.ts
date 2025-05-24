import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { Usuario } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { RolProtected } from './decorator/rol-protected.decorator';
import { Rol } from './interfaces/valid-rol';
import { Auth } from './decorator/auth.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // @Auth(Rol.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('revalidate')
  @ApiBearerAuth('token') 
  @UseGuards(AuthGuard())
  validateToken(@Req() req: Express.Request, @GetUser() user: Usuario) {
    return {
      ok: true,
      msg: 'Validando el token',
      user,
    };
  }

  @Get('validate')
  @ApiBearerAuth('token') 
  @RolProtected(Rol.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  findvalidateUser(@GetUser() user: Usuario) {
    return {
      ok: true,
      user,
    };
  }

  @Get('validateData')
  @ApiBearerAuth('token') 
  @Auth()
  validateData(@GetUser() user: Usuario) {
    return {
      ok: true,
      user,
    };
  }

  @Get('check-status')
  @ApiBearerAuth('token') 
  @Auth()
  checkAuthStatus(@GetUser() user: Usuario) {
    return this.authService.checkAuthStatus(user);
  }
}