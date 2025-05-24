import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permisos: string[];
}
