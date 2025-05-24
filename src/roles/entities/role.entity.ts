import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permiso } from "./permisos.entity";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('varchar', { unique: true })
  nombre: string;

  @ManyToMany(() => Permiso, { cascade: true })
  @JoinTable({name: 'rol_permisos'})
  permisos: Permiso[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;



}
