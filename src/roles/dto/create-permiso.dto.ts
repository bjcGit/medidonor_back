import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePermisoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string; // Ejemplo: 'usuarios:listar'
}