import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateMedicamentoDto {

    @ApiProperty()
    @IsString({ message: 'El nombre es necesario' })
    @MinLength(3, {message: 'Minimo tres caracteres'})
    nombre: string

    @ApiProperty()
    @IsNumber({}, {message: 'Los miligramos son necesarios'})
    @IsPositive()
    miligramos: number

    @ApiProperty()
    @IsNumber({}, {message: 'Las cantidad son necesarias'})
    @IsPositive()
    cantidad: number

    @ApiProperty()
    @IsString({ message: 'El laboratorio es necesario' })
    @MinLength(3, {message: 'Minimo tres caracteres'})
    laboratorio: string

    @ApiProperty()
    @IsString({ message: 'La descripcion es necesario' })
    @MinLength(3, {message: 'Minimo tres caracteres'})
    descripcion: string

    @ApiProperty()
    @IsString({ message: 'El ID del usuario es necesario' })
    usuarioId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    disponibilidad?: string

    @ApiProperty()
    @IsString({ message: 'La fecha de vencimiento es necesaria' })
    @MinLength(3, {message: 'Minimo tres caracteres'})
    fecha_vencimiento: string

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isActive: boolean

}
