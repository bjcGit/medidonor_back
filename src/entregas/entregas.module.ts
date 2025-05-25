import { Module } from '@nestjs/common';
import { EntregasService } from './entregas.service';
import { EntregasController } from './entregas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrega } from './entities/entregas.entity';
import { MedicamentosService } from 'src/medicamentos/medicamentos.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Medicamento } from 'src/medicamentos/entities/medicamento.entity';
import { Usuario } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MedicamentosModule } from '../medicamentos/medicamentos.module';

@Module({
  controllers: [EntregasController],
  providers: [EntregasService, MedicamentosService, UsuariosService],
  imports: [
    TypeOrmModule.forFeature([Entrega, Medicamento, Usuario]),
    AuthModule,
    MedicamentosModule

  ]
})
export class EntregasModule {}
