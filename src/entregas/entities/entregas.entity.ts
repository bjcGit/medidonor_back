import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from 'src/auth/entities/user.entity';
import { Medicamento } from 'src/medicamentos/entities/medicamento.entity';

@Entity('entregas')
export class Entrega {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario, { nullable: false, eager: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToOne(() => Medicamento, { nullable: false, eager: true })
  @JoinColumn({ name: 'medicamentoId' })
  medicamento: Medicamento;

  @Column('text', { nullable: true, default: 'No registra' })
  fechaEntrega: string;

  @Column('int')
  cantidadEntregada: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('boolean', { default: true })
  isActive: boolean;
}