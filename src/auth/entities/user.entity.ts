import { Medicamento } from 'src/medicamentos/entities/medicamento.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text',{
    array: true,
    nullable: true,
    default: ['USER']
  })
  rols: string[];
  
  @Column('text',{ unique: true})
  documento: string;

  @Column('text')
  nombre: string;

  @Column('text', { unique: true })
  telefono: string;

  @Column('text', { nullable: true, default: 'No registra' })
  correo: string;

  @Column('text', { select: false, nullable: true, default: 'No registra' })
  password: string;

  @Column('text', { nullable: true, default: 'No registra' })
  direccion: string;

  @OneToMany(() => Medicamento, (medicamento) => medicamento.usuario)
  medicamentos: Medicamento[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

}
