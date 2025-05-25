import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from "class-validator";

export class CreateEntregasDto {
  @ApiProperty({ description: "UUID del usuario que recibe la entrega" })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ description: "UUID del medicamento entregado" })
  @IsUUID()
  medicamentoId: string;
  @ApiProperty({
    description: "Fecha de la entrega (formato YYYY-MM-DD)",
    required: false,
  })
  
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "La fechaEntrega debe tener el formato YYYY-MM-DD",
  })
  fechaEntrega?: string;

  @ApiProperty({ description: "Cantidad de medicamento entregada" })
  @IsInt()
  @Min(1)
  cantidadEntregada: number;
}
