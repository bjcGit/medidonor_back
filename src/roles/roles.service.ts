import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Permiso } from './entities/permisos.entity';


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { nombre, permisos } = createRoleDto;

    // Buscar permisos existentes y crear los que no existan
    const permisosEntities: Permiso[] = [];
    for (const nombrePermiso of permisos) {
      let permiso = await this.permisoRepository.findOne({ where: { nombre: nombrePermiso } });
      if (!permiso) {
        permiso = this.permisoRepository.create({ nombre: nombrePermiso });
        await this.permisoRepository.save(permiso);
      }
      permisosEntities.push(permiso);
    }

    // Crear el rol con los permisos
    const role = this.roleRepository.create({
      nombre,
      permisos: permisosEntities,
    });

    await this.roleRepository.save(role);
    return role;
  }

  async findAll() {
    return this.roleRepository.find({ relations: ['permisos'] });
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permisos'],
    });
    if (!role) throw new NotFoundException('Rol no encontrado');
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['permisos'] });
    if (!role) throw new NotFoundException('Rol no encontrado');

    if (updateRoleDto.nombre) {
      role.nombre = updateRoleDto.nombre;
    }

    if (updateRoleDto.permisos) {
      const permisosEntities: Permiso[] = [];
      for (const nombrePermiso of updateRoleDto.permisos) {
        let permiso = await this.permisoRepository.findOne({ where: { nombre: nombrePermiso } });
        if (!permiso) {
          permiso = this.permisoRepository.create({ nombre: nombrePermiso });
          await this.permisoRepository.save(permiso);
        }
        permisosEntities.push(permiso);
      }
      role.permisos = permisosEntities;
    }

    await this.roleRepository.save(role);
    return role;
  }

  async remove(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Rol no encontrado');
    await this.roleRepository.remove(role);
    return { ok: true, msg: 'Rol eliminado' };
  }
}