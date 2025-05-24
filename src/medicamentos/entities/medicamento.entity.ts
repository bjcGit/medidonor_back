import { Column, PrimaryGeneratedColumn } from "typeorm"

export class Medicamento {
    
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    nombre: string

    @Column('int',{
        default: 0
    })
    miligramos: number
    
    @Column('int',{
        default: 0
    })
    cantidad: number
    
    @Column('text',{
        nullable: true,
        default: 'No registra'
    })
    laboratorio: string

    @Column('text',{
        nullable: true,
        default: 'No registra'
    })
    descripcion: string
    
    @Column('text')
    usuario: string
    
    @Column('text',{
        nullable: true,
        default: 'Disponible'
    })
    disponibilidad: string
    
    @Column('boolean')
    isActive: boolean
    
    @Column('text')
    feche_vencimiento: string
    

    creatAt: Date


    updateAt:Date



}
