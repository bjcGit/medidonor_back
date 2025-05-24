import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleCustomError } from 'src/functions/error';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly authRepository: Repository<Usuario>,
    private readonly jwtService: JwtService
  ) { }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginUserDto: LoginUserDto) {
    const { correo, password } = loginUserDto;
   
    const user = await this.authRepository.findOne({
      where: { correo },
      select: {
        correo: true,
        id: true, 
        rols: true,
        nombre: true,
        isActive: true
      }
    });

    if (!user) {
      throw new BadRequestException('Necesitas permisos del administrador del aplicativo para ingresar aquí');
    }

    if (!user.isActive) {
      throw new BadRequestException('Usuario desactivado, comunicate con el administrador');
    }
    // Respuesta exitosa incluyendo manejo de error de servicio externo
    return {
        token: this.getJwtToken({ id: user.id }),
        user: {
          id: user.id,
          correo: user.correo,
          nombre: user.nombre,
          rol: user.rols,
  
        },
       
    };
  }


  async checkAuthStatus(user: Usuario){
    const {id} = user
    const token = this.getJwtToken({id})
    return {
      ok: true,    
      id,
      token,
      user
    }
  }

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
  try {
    const { correo, telefono, documento } = createUserDto;

    // Validar correo
    const correoExistente = await this.authRepository.findOne({ where: { correo } });
    if (correoExistente) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Validar teléfono
    const telefonoExistente = await this.authRepository.findOne({ where: { telefono } });
    if (telefonoExistente) {
      throw new BadRequestException('El teléfono ya está registrado');
    }

    // Validar documento
    const documentoExistente = await this.authRepository.findOne({ where: { documento } });
    if (documentoExistente) {
      throw new BadRequestException('El documento ya está registrado');
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crear el usuario con la contraseña encriptada
    const user = this.authRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.authRepository.save(user);

    // No retornar la contraseña en la respuesta
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Usuario;
  } catch (error) {
    console.log(error);
    throw handleCustomError(error);
  }
}


}
