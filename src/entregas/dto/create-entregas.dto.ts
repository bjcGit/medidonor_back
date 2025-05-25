import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsUUID, Min } from "class-validator";

export class CreateEntregasDto {
  @ApiProperty({ description: "UUID del usuario que recibe la entrega" })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ description: "UUID del medicamento entregado" })
  @IsUUID()
  medicamentoId: string;

  @ApiProperty({ description: "Fecha de la entrega (formato ISO)" })
  @IsDateString()
  fechaEntrega: Date;

  @ApiProperty({ description: "Cantidad de medicamento entregada" })
  @IsInt()
  @Min(1)
  cantidadEntregada: number;
}
