import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsJSON, IsNumber, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsString({
        message: 'El rol es necesario'})
    rol: string

    @ApiProperty()
    @IsString({message: 'El documento es necesario'})
    documento: string

    @ApiProperty()
    @IsString({
        message: 'El nombre es necesario'
    })
    nombre: string;

    @ApiProperty()
    @IsString({
        message: 'El telefono es necesario'
    })
    @Matches(/^[0-9]{10}$/, { message: 'El telefono debe tener 10 digitos' })
    telefono: string;

    @ApiProperty()
    @IsString({
        message: 'El correo es necesario'
    })
    @IsEmail({}, { message: 'El correo no es valido' })
    correo: string;

    @ApiProperty()
    @IsString({
        message: 'La contraseña es necesaria'
    })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @MaxLength(20, { message: 'La contraseña no puede tener mas de 20 caracteres' })
    password: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    direccion?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;


}
