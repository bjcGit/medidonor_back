import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

    @ApiProperty()
    @IsString()
    correo: string;

    @ApiProperty()
    @IsString()
    password: string;

}
