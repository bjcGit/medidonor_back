import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { CreateEntregasDto } from "./dto/create-entregas.dto";
import { UpdateEntregasDto } from "./dto/update-entregas.dto";
import { Entrega } from "./entities/entregas.entity";
import { MedicamentosService } from "src/medicamentos/medicamentos.service";
import { UsuariosService } from "src/usuarios/usuarios.service";
import { Medicamento } from "src/medicamentos/entities/medicamento.entity";
import { handleCustomError } from "src/functions/error";

@Injectable()
export class EntregasService {
  private readonly logger = new Logger(EntregasService.name);

  constructor(
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
    private readonly usuariosService: UsuariosService,
    private readonly medicamentosService: MedicamentosService,
    private readonly dataSource: DataSource // Inyectar DataSource para QueryRunner
  ) {}

  async create(createEntregaDto: CreateEntregasDto): Promise<Entrega> {
    
    // Validar usuario
    const usuario = await this.usuariosService.findOne(createEntregaDto.usuarioId);
    if (!usuario ) {
      throw new BadRequestException("Usuario no valido o inactivo");
    }

    if (!usuario.isActive ) {
      throw new BadRequestException("Usuario inactivo");
    }

    // Validar medicamento
    const medicamento = await this.medicamentosService.findOne(createEntregaDto.medicamentoId);
    if (!medicamento || !medicamento.isActive || medicamento.disponibilidad !== "Disponible") {
      throw new BadRequestException("Medicamento inválido, inactivo o no disponible");
    }

    // Validar cantidad disponible
    if (medicamento.cantidad < createEntregaDto.cantidadEntregada) {
      this.logger.warn(`Cantidad insuficiente para medicamento ${medicamento.nombre}. Disponible: ${medicamento.cantidad}, Solicitada: ${createEntregaDto.cantidadEntregada}`);
      throw new BadRequestException("Cantidad insuficiente de medicamento");
    }

    // Validar fecha de entrega
    // const fechaEntrega = new Date(createEntregaDto.fechaEntrega);
    // const hoy = new Date();
    // if (fechaEntrega < hoy) {
    //   throw new BadRequestException("La fecha de entrega no puede ser en el pasado");
    // }

    // Usar QueryRunner para transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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
        medicamento.disponibilidad = "Agotado";
      }

      // Actualizar el medicamento dentro de la transacción
      await queryRunner.manager.update(Medicamento, { id: medicamento.id }, {
        cantidad: medicamento.cantidad,
        disponibilidad: medicamento.disponibilidad,
      });

      // Guardar la entrega
      const savedEntrega = await queryRunner.manager.save(entrega);
      await queryRunner.commitTransaction();

      return savedEntrega;
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error al crear la entrega: ${error.message}`);
      throw new BadRequestException("No se pudo crear la entrega");
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Entrega[]> {
    this.logger.log("Buscando todas las entregas");
    // Usar QueryBuilder para una consulta más optimizada
    const entregas = await this.entregaRepository
      .createQueryBuilder("entrega")
      .leftJoinAndSelect("entrega.usuario", "usuario")
      .leftJoinAndSelect("entrega.medicamento", "medicamento")
      .where("entrega.isActive = :isActive", { isActive: true })
      .getMany();
    return entregas;
  }

  async findOne(id: string): Promise<Entrega> {
    this.logger.log(`Buscando entrega con ID ${id}`);
    // Usar QueryBuilder para obtener la entrega
    const entrega = await this.entregaRepository
      .createQueryBuilder("entrega")
      .leftJoinAndSelect("entrega.usuario", "usuario")
      .leftJoinAndSelect("entrega.medicamento", "medicamento")
      .where("entrega.id = :id", { id })
      .andWhere("entrega.isActive = :isActive", { isActive: true })
      .getOne();

    if (!entrega) {
      this.logger.warn(`Entrega con ID ${id} no encontrada`);
      throw new NotFoundException("Entrega no encontrada");
    }
    return entrega;
  }

 async update(id: string, updateEntregaDto: UpdateEntregasDto): Promise<Entrega> {
 
  const entrega = await this.findOne(id);

  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Validar usuario si se proporciona
    if (updateEntregaDto.usuarioId) {
      const usuario = await this.usuariosService.findOne(updateEntregaDto.usuarioId);
      if (!usuario || !usuario.isActive) {
        this.logger.warn(`Usuario con ID ${updateEntregaDto.usuarioId} no encontrado o inactivo`);
        throw new BadRequestException('Usuario inválido o inactivo');
      }
      entrega.usuario = usuario;
      this.logger.log(`Usuario actualizado a ${usuario.nombre} (ID: ${usuario.id})`);
    }

    // Validar medicamento si se proporciona
    let medicamento = entrega.medicamento;
    if (updateEntregaDto.medicamentoId) {
      medicamento = await this.medicamentosService.findOne(updateEntregaDto.medicamentoId);
      if (!medicamento || !medicamento.isActive || medicamento.disponibilidad !== 'Disponible') {
        this.logger.warn(`Medicamento con ID ${updateEntregaDto.medicamentoId} no encontrado, inactivo o no disponible`);
        throw new BadRequestException('Medicamento inválido, inactivo o no disponible');
      }
      entrega.medicamento = medicamento;
      this.logger.log(`Medicamento actualizado a ${medicamento.nombre} (ID: ${medicamento.id})`);
    }

    // Validar cantidad si se proporciona
    if (updateEntregaDto.cantidadEntregada) {
      // Revalidar el medicamento para evitar problemas de concurrencia
      const medicamentoActual = await queryRunner.manager.findOne(Medicamento, {
        where: { id: medicamento.id, isActive: true, disponibilidad: 'Disponible' },
      });
      if (!medicamentoActual) {
        this.logger.warn(`Medicamento con ID ${medicamento.id} no es válido en la transacción`);
        throw new BadRequestException('Medicamento no disponible o inválido');
      }

      const diferencia = updateEntregaDto.cantidadEntregada - entrega.cantidadEntregada;
      if (diferencia > 0 && medicamentoActual.cantidad < diferencia) {
        throw new BadRequestException('Cantidad insuficiente de medicamento');
      }

      // Actualizar la cantidad del medicamento
      medicamentoActual.cantidad -= diferencia;
      if (medicamentoActual.cantidad === 0) {
        medicamentoActual.disponibilidad = 'Agotado';
      }
      await queryRunner.manager.update(Medicamento, { id: medicamentoActual.id }, {
        cantidad: medicamentoActual.cantidad,
        disponibilidad: medicamentoActual.disponibilidad,
      });
      entrega.cantidadEntregada = updateEntregaDto.cantidadEntregada;
      entrega.medicamento = medicamentoActual;
    }

    // Actualizar fechaEntrega si se proporciona
    if (updateEntregaDto.fechaEntrega !== undefined) {
      entrega.fechaEntrega = updateEntregaDto.fechaEntrega || 'No registra';
      this.logger.log(`Fecha de entrega actualizada a ${entrega.fechaEntrega}`);
    }

    const updatedEntrega = await queryRunner.manager.save(entrega);
    await queryRunner.commitTransaction();
    this.logger.log(`Entrega con ID ${id} actualizada exitosamente`);
    return updatedEntrega;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    this.logger.error(`Error al actualizar la entrega con ID ${id}: ${error.message}`);
    throw handleCustomError(error);
  } finally {
    await queryRunner.release();
  }
}

  async remove(id: string): Promise<void> {
    this.logger.log(`Eliminando entrega con ID ${id}`);
    const entrega = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Restaurar la cantidad del medicamento
      entrega.medicamento.cantidad += entrega.cantidadEntregada;
      entrega.medicamento.disponibilidad = entrega.medicamento.cantidad > 0 ? "Disponible" : "Agotado";
      await queryRunner.manager.update(Medicamento, { id: entrega.medicamento.id }, {
        cantidad: entrega.medicamento.cantidad,
        disponibilidad: entrega.medicamento.disponibilidad,
      });

      // Eliminar la entrega
      await queryRunner.manager.remove(entrega);
      await queryRunner.commitTransaction();

      this.logger.log(`Entrega con ID ${id} eliminada y cantidad restaurada`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error al eliminar la entrega: ${error.message}`);
      throw new BadRequestException("No se pudo eliminar la entrega");
    } finally {
      await queryRunner.release();
    }
  }
}