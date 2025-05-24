import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "./entities/user.entity";
import { Repository } from "typeorm";
import { handleCustomError } from "src/functions/error";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtPayload } from "./interfaces/jwt-payload";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly authRepository: Repository<Usuario>,
    private readonly jwtService: JwtService
  ) {}

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { correo, password } = loginUserDto;

      const user = await this.authRepository.findOne({
        where: { correo },
        select: {
          id: true,
          correo: true,
          rols: true,
          nombre: true,
          isActive: true,
          password: true,
        },
      });

      // Verificar si el usuario existe
      if (!user) {
        throw new BadRequestException("Credenciales incorrectas");
      }

      // Verificar si el usuario está activo
      if (!user.isActive) {
        throw new BadRequestException(
          "Usuario desactivado, comunícate con el administrador"
        );
      }

      // Validar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException("Credenciales incorrectas");
      }

      // Respuesta exitosa, excluyendo la contraseña
      return {
        token: this.getJwtToken({ id: user.id }),
        user: {
          id: user.id,
          correo: user.correo,
          nombre: user.nombre,
          rols: user.rols,
        },
      };
    } catch (error) {
      console.log(error);
      throw handleCustomError(error);
    }
  }

  async checkAuthStatus(user: Usuario) {
    const { id } = user;
    const token = this.getJwtToken({ id });
    return {
      ok: true,
      id,
      token,
      user,
    };
  }

  async create(
    createUserDto: CreateUserDto
  ): Promise<{ token: string; user: Partial<Usuario> }> {
    try {
      const { correo, telefono, documento } = createUserDto;

      // Validar correo
      const correoExistente = await this.authRepository.findOne({
        where: { correo },
      });
      if (correoExistente) {
        throw new BadRequestException("El correo ya está registrado");
      }

      // Validar teléfono
      const telefonoExistente = await this.authRepository.findOne({
        where: { telefono },
      });
      if (telefonoExistente) {
        throw new BadRequestException("El teléfono ya está registrado");
      }

      // Validar documento
      const documentoExistente = await this.authRepository.findOne({
        where: { documento },
      });
      if (documentoExistente) {
        throw new BadRequestException("El documento ya está registrado");
      }

      // Encriptar la contraseña antes de guardar
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Crear el usuario con la contraseña encriptada
      const user = this.authRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      await this.authRepository.save(user);

      // Generar el token JWT
      const token = this.getJwtToken({ id: user.id });

      // Retornar solo los campos deseados del usuario, excluyendo la contraseña
      const userResponse = {
        id: user.id,
        correo: user.correo,
        nombre: user.nombre,
        rols: user.rols,
      };

      return {
        token,
        user: userResponse,
      };
    } catch (error) {
      console.log(error);
      throw handleCustomError(error);
    }
  }
}
