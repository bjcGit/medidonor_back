
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {

  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column('varchar')
  rol: string;
  
  @Column('varchar',{ unique: true})
  documento: string;

  @Column('varchar')
  nombre: string;

  @Column('varchar', { unique: true })
  telefono: string;

  @Column('varchar', { unique: true })
  correo: string;

  @Column('varchar', { select: false })
  password: string;

  @Column('varchar', { nullable: true, default: 'No registra' })
  direccion: string;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable({name: 'rol_usuario'})
  roles: Role[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

}
