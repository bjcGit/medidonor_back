import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
} from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { UpdateUserDto } from "src/auth/dto/update-user.dto";
import { Auth } from "src/auth/decorator/auth.decorator";
import { Rol } from "src/auth/interfaces/valid-rol";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("usuarios")
@Controller("usuarios")
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get("")
  @Auth(Rol.admin)
  findAll(@Query("page") page?: number, @Query("limit") limit?: number) {
    return this.usuariosService.findAll(page, limit);
  }

  @Get("/:id")
  // @Auth(Rol.admin)
  findOne(@Param("id") uid: string) {
    return this.usuariosService.findOne(uid);
  }

  @Patch("/:id")
  // @Auth(Rol.admin)
  update(@Param("id") uid: string, @Body() updateUsuarioDto: UpdateUserDto) {
    return this.usuariosService.update(uid, updateUsuarioDto);
  }

  @Patch("desactivar/:id")
  // @Auth(Rol.admin)
  desactivar(@Param("id") uid: string) {
    return this.usuariosService.desactivar(uid);
  }
}
