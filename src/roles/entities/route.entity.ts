import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Permiso } from './permisos.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @ManyToMany(() => Permiso, { cascade: true })
  @JoinTable({name: 'route_permisos'})
  permisos: Permiso[];
}