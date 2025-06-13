import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";

export class CompuestoDto {
  @ApiProperty({ description: "Nombre del compuesto" })
  @IsString()
  nombre: string;

  @ApiProperty({ description: "Cantidad en miligramos del compuesto" })
  @IsNumber()
  miligramos: number;
}