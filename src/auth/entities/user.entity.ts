import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column('text', { unique: true })
  correo: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { nullable: true, default: 'No registra' })
  direccion: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

}
