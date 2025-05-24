import { Usuario } from "src/auth/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("medicamentos")
export class Medicamento {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  nombre: string;

  @Column("int", { default: 0 })
  miligramos: number;

  @Column("int", { default: 0 })
  cantidad: number;

  @Column("text", { nullable: true, default: "No registra" })
  laboratorio: string;

  @Column("text", { nullable: true, default: "No registra" })
  descripcion: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.medicamentos, { nullable: false })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column("text", { nullable: true, default: "Disponible" })
  disponibilidad: string;

  @Column("text")
  fecha_vencimiento: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column("boolean", { default: true })
  isActive: boolean;
}
