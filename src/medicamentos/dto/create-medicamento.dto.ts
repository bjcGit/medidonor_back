import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsNumber, IsOptional, IsPositive, IsString, MinLength, ValidateNested } from "class-validator"
import { CompuestoDto } from "./compuesto-medicamento.dto"
import { Type } from "class-transformer"

export class CreateMedicamentoDto {

    @ApiProperty()
    @IsString({ message: 'El nombre es necesario' })
    @MinLength(3, { message: 'Minimo tres caracteres' })
    nombre: string

    @ApiProperty()
    @IsNumber({}, { message: 'Los miligramos son necesarios' })
    @IsPositive()
    miligramos: number

    @ApiProperty()
    @IsNumber({}, { message: 'Las cantidad son necesarias' })
    @IsPositive()
    cantidad: number

    @ApiProperty()
    @IsString({ message: 'El laboratorio es necesario' })
    @MinLength(3, { message: 'Minimo tres caracteres' })
    laboratorio: string

    @ApiProperty()
    @IsString({ message: 'La descripcion es necesario' })
    @MinLength(3, { message: 'Minimo tres caracteres' })
    descripcion: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    disponibilidad?: string

    @ApiProperty()
    @IsString({ message: 'La fecha de vencimiento es necesaria' })
    @MinLength(3, { message: 'Minimo tres caracteres' })
    fecha_vencimiento: string

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isActive: boolean

    @ApiProperty({
        description: "Array de compuestos del medicamento",
        type: [CompuestoDto],
        required: false,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CompuestoDto)
    @IsOptional()
    compuesto?: CompuestoDto[];

}
