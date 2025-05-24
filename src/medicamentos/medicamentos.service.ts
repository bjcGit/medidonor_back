import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicamento } from './entities/medicamento.entity';
import { Repository } from 'typeorm';
import { handleCustomError } from 'src/functions/error';
import { Usuario } from 'src/auth/entities/user.entity';

@Injectable()
export class MedicamentosService {

  constructor(
    @InjectRepository(Medicamento)
    private readonly medicamentoRepository: Repository<Medicamento>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ){}

async create(createMedicamentoDto: CreateMedicamentoDto, usuario: Usuario) {
    try {
      const medicamento = this.medicamentoRepository.create({
        ...createMedicamentoDto,
        usuario, 
      });
      await this.medicamentoRepository.save(medicamento);

      return {
        medicamento,
        usuario: usuario.nombre, 
      };
    } catch (error) {
      console.log(error);
      throw handleCustomError(error);
    }
  }

  async findAll() {
    try {
      const medicamentos = await this.medicamentoRepository.find({
        where: { isActive: true },
        relations: ['usuario'], // Incluir datos del usuario
        select: {
          usuario: { id: true, nombre: true }, // Seleccionar solo id y nombre del usuario
        },
      });

      return medicamentos

    } catch (error) {
      console.log(error);
      throw handleCustomError(error);
    }
  }

  async findOne(id: string) {
    try {
      const medicamento = await this.medicamentoRepository.findOne({
        where: { id, isActive: true },
        relations: ['usuario'],
        select: {
          usuario: { id: true, nombre: true },
        },
      });
      if (!medicamento) {
        throw new NotFoundException(`Medicamento con ID ${id} no encontrado`);
      }
      return medicamento;
    } catch (error) {
      console.log(error);
      throw handleCustomError(error);
    }
  }

  async update(id: string, updateMedicamentoDto: UpdateMedicamentoDto, usuario: Usuario) {
    try {
      const medicamento = await this.findOne(id);
          const updatedMedicamento = this.medicamentoRepository.merge(medicamento, {
        ...updateMedicamentoDto,
        usuario: usuario || medicamento.usuario, 
      });
      await this.medicamentoRepository.save(updatedMedicamento);

      return {
        medicamento,
        usuario: usuario.nombre
      }

    } catch (error) {
      console.log(error);
      throw handleCustomError(error);
    }
  }

  async remove(id: string) {
    try {
      const medicamento = await this.findOne(id); // Verificar existencia
      await this.medicamentoRepository.update(id, { isActive: false }); // Soft delete
      return { 
        medicamento,
        message: `Medicamento con ID ${medicamento.nombre} eliminado`
       };
    } catch (error) {
      console.log(error);
      throw handleCustomError(error);
    }
  }
}
