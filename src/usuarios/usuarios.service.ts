import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { Usuario } from 'src/auth/entities/user.entity';
import { paginate } from 'src/common/helpers/pagination.helper';
import { handleCustomError } from 'src/functions/error';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async findAll(page = 1, limit = 10) {
    try {
      const [usuarios, total] = await this.usuarioRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });

      return paginate(usuarios, total, page, limit); // <-- Usa el helper
    } catch (error) {
      console.log(error);
      throw new BadRequestException('No es posible traer los usuarios');
    }
  }

  async findOne(id: string): Promise<Usuario> {

    try {

      const usuario = await this.usuarioRepository.findOneBy({ id })

      if (!usuario.isActive) {
        throw new BadRequestException('El usuario esta desactivado')
      } else {
        return usuario
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(`No se encontro el ID: ${id}`)
    }
  }

async update(id: string, updateUserDto: UpdateUserDto): Promise<Usuario> {
  try {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar correo si se va a actualizar
    if (updateUserDto.correo && updateUserDto.correo !== usuario.correo) {
      const correoExistente = await this.usuarioRepository.findOne({ where: { correo: updateUserDto.correo } });
      if (correoExistente && correoExistente.id !== id) {
        throw new BadRequestException('El correo ya está registrado');
      }
    }

    // Validar teléfono si se va a actualizar
    if (updateUserDto.telefono && updateUserDto.telefono !== usuario.telefono) {
      const telefonoExistente = await this.usuarioRepository.findOne({ where: { telefono: updateUserDto.telefono } });
      if (telefonoExistente && telefonoExistente.id !== id) {
        throw new BadRequestException('El teléfono ya está registrado');
      }
    }

    // Validar documento si se va a actualizar
    if (updateUserDto.documento && updateUserDto.documento !== usuario.documento) {
      const documentoExistente = await this.usuarioRepository.findOne({ where: { documento: updateUserDto.documento } });
      if (documentoExistente && documentoExistente.id !== id) {
        throw new BadRequestException('El documento ya está registrado');
      }
    }

    // Encriptar la contraseña si se va a actualizar
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Actualizar el usuario
    const usuarioActualizado = this.usuarioRepository.merge(usuario, updateUserDto);
    await this.usuarioRepository.save(usuarioActualizado);

    // No retornar la contraseña en la respuesta
    const { password, ...userWithoutPassword } = usuarioActualizado;
    return userWithoutPassword as Usuario;
  } catch (error) {
    throw handleCustomError(error);
  }
}

  async desactivar(id: string) {
    try {
    
      const usuario = await this.usuarioRepository.findOneBy({ id });

      if (!usuario) {
        throw new BadRequestException('El usuario no existe');
      }
    
      await this.usuarioRepository.update(id, { isActive: !usuario.isActive });

      const estadoActualizado = usuario.isActive ? 'desactivado' : 'activado';
      return { mensaje: `Usuario ${estadoActualizado} correctamente` };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`No se pudo cambiar el estado del usuario con el ID: ${id}`);
    }
  }

  async findByDocumento(documento: string): Promise<Usuario> {
    try {
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.medicamentos', 'medicamentos')
        .where('usuario.documento = :documento', { documento })
        .andWhere('usuario.isActive = :isActive', { isActive: true })
        .select([
          'usuario.id',
          'usuario.documento',
          'usuario.nombre',
          'usuario.telefono',
          'usuario.correo',
          'usuario.direccion',
          'usuario.rols',
          'usuario.isActive',
          'medicamentos.id',
          'medicamentos.nombre',
          'medicamentos.cantidad',
          'medicamentos.disponibilidad',
        ])
        .getOne();

      if (!usuario) {
        throw new NotFoundException(`No se encontró el usuario con documento: ${documento}`);
      }

      // Excluir la contraseña de la respuesta
      const { password, ...userWithoutPassword } = usuario;
      return userWithoutPassword as Usuario;
    } catch (error) {
      this.logger.error(`Error al buscar usuario por documento ${documento}: ${error.message}`);
      throw handleCustomError(error);
    }
  }

}
