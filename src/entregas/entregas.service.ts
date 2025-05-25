import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEntregasDto } from './dto/create-entregas.dto';
import { UpdateEntregasDto } from './dto/update-entregas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicamentosService } from 'src/medicamentos/medicamentos.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Repository } from 'typeorm';
import { Entrega } from './entities/entregas.entity';
import { Usuario } from 'src/auth/entities/user.entity';

@Injectable()
export class EntregasService {
  private readonly logger = new Logger(EntregasService.name);
  constructor(
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
    private readonly usuariosService: UsuariosService,
    private readonly medicamentosService: MedicamentosService,
  ) {}
async create(createEntregaDto: CreateEntregasDto): Promise<Entrega> {
  this.logger.log(`Creando entrega con DTO: ${JSON.stringify(createEntregaDto)}`);

  // Validar usuario
  const usuario = await this.usuariosService.findOne(createEntregaDto.usuarioId);
  if (!usuario || !usuario.isActive) {
    this.logger.warn(`Usuario con ID ${createEntregaDto.usuarioId} no encontrado o inactivo`);
    throw new BadRequestException('Usuario inválido o inactivo');
  }

  // Validar medicamento
  const medicamento = await this.medicamentosService.findOne(createEntregaDto.medicamentoId);
  if (!medicamento || !medicamento.isActive || medicamento.disponibilidad !== 'Disponible') {
    this.logger.warn(`Medicamento con ID ${createEntregaDto.medicamentoId} no encontrado, inactivo o no disponible`);
    throw new BadRequestException('Medicamento inválido, inactivo o no disponible');
  }

  // Validar cantidad disponible
  if (medicamento.cantidad < createEntregaDto.cantidadEntregada) {
    this.logger.warn(`Cantidad insuficiente para medicamento ${medicamento.nombre}. Disponible: ${medicamento.cantidad}, Solicitada: ${createEntregaDto.cantidadEntregada}`);
    throw new BadRequestException('Cantidad insuficiente de medicamento');
  }

  // Validar fecha de entrega
  const fechaEntrega = new Date(createEntregaDto.fechaEntrega);
  const hoy = new Date();
  if (fechaEntrega < hoy) {
    this.logger.warn(`Fecha de entrega ${createEntregaDto.fechaEntrega} es anterior a la fecha actual`);
    throw new BadRequestException('La fecha de entrega no puede ser en el pasado');
  }

  try {
    // Crear la entrega
    const entrega = this.entregaRepository.create({
      ...createEntregaDto,
      usuario,
      medicamento,
    });

    // Descontar la cantidad del medicamento
    medicamento.cantidad -= createEntregaDto.cantidadEntregada;
    if (medicamento.cantidad === 0) {
      medicamento.disponibilidad = 'Agotado';
    }

    // Pasar el usuario asociado al medicamento
    await this.medicamentosService.update(
      medicamento.id,
      { cantidad: medicamento.cantidad, disponibilidad: medicamento.disponibilidad },
      medicamento.usuario // Usar el usuario asociado al medicamento
    );

    // Guardar la entrega
    await this.entregaRepository.save(entrega);
    this.logger.log(`Entrega creada con ID ${entrega.id}`);
    return entrega;
  } catch (error) {
    this.logger.error(`Error al crear la entrega: ${error.message}`);
    throw new BadRequestException('No se pudo crear la entrega');
  }
}

  async findAll(): Promise<Entrega[]> {
    this.logger.log('Buscando todas las entregas');
    return this.entregaRepository.find();
  }

  async findOne(id: string): Promise<Entrega> {
    this.logger.log(`Buscando entrega con ID ${id}`);
    const entrega = await this.entregaRepository.findOneBy({ id });
    if (!entrega) {
      this.logger.warn(`Entrega con ID ${id} no encontrada`);
      throw new NotFoundException('Entrega no encontrada');
    }
    return entrega;
  }

async update(id: string, updateEntregaDto: UpdateEntregasDto): Promise<Entrega> {
  this.logger.log(`Actualizando entrega con ID ${id}, DTO: ${JSON.stringify(updateEntregaDto)}`);
  const entrega = await this.findOne(id);

  // Validar usuario si se proporciona
  if (updateEntregaDto.usuarioId) {
    const usuario = await this.usuariosService.findOne(updateEntregaDto.usuarioId);
    if (!usuario || !usuario.isActive) {
      this.logger.warn(`Usuario con ID ${updateEntregaDto.usuarioId} no encontrado o inactivo`);
      throw new BadRequestException('Usuario inválido o inactivo');
    }
    entrega.usuario = usuario;
  }

  // Validar medicamento si se proporciona
  if (updateEntregaDto.medicamentoId) {
    const medicamento = await this.medicamentosService.findOne(updateEntregaDto.medicamentoId);
    if (!medicamento || !medicamento.isActive || medicamento.disponibilidad !== 'Disponible') {
      this.logger.warn(`Medicamento con ID ${updateEntregaDto.medicamentoId} no encontrado, inactivo o no disponible`);
      throw new BadRequestException('Medicamento inválido, inactivo o no disponible');
    }
    entrega.medicamento = medicamento;
  }

  // Validar cantidad si se proporciona
  if (updateEntregaDto.cantidadEntregada) {
    const diferencia = updateEntregaDto.cantidadEntregada - entrega.cantidadEntregada;
    if (diferencia > 0 && entrega.medicamento.cantidad < diferencia) {
      this.logger.warn(`Cantidad insuficiente para medicamento ${entrega.medicamento.nombre}. Disponible: ${entrega.medicamento.cantidad}, Solicitada: ${diferencia}`);
      throw new BadRequestException('Cantidad insuficiente de medicamento');
    }
    entrega.medicamento.cantidad -= diferencia;
    if (entrega.medicamento.cantidad === 0) {
      entrega.medicamento.disponibilidad = 'Agotado';
    }
    await this.medicamentosService.update(
      entrega.medicamento.id,
      {
        cantidad: entrega.medicamento.cantidad,
        disponibilidad: entrega.medicamento.disponibilidad,
      },
      entrega.medicamento.usuario // Usar el usuario asociado al medicamento
    );
    entrega.cantidadEntregada = updateEntregaDto.cantidadEntregada;
  }

  // Validar fecha si se proporciona
  if (updateEntregaDto.fechaEntrega) {
    const fechaEntrega = new Date(updateEntregaDto.fechaEntrega);
    const hoy = new Date();
    if (fechaEntrega < hoy) {
      this.logger.warn(`Fecha de entrega ${updateEntregaDto.fechaEntrega} es anterior a la fecha actual`);
      throw new BadRequestException('La fecha de entrega no puede ser en el pasado');
    }
    entrega.fechaEntrega = fechaEntrega;
  }

  try {
    await this.entregaRepository.save(entrega);
    this.logger.log(`Entrega con ID ${id} actualizada`);
    return entrega;
  } catch (error) {
    this.logger.error(`Error al actualizar la entrega: ${error.message}`);
    throw new BadRequestException('No se pudo actualizar la entrega');
  }
}

  async remove(id: string): Promise<void> {
    this.logger.log(`Eliminando entrega con ID ${id}`);
    const entrega = await this.findOne(id);
    await this.entregaRepository.remove(entrega);
    this.logger.log(`Entrega con ID ${id} eliminada`);
  }
}
