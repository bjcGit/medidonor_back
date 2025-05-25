import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { EntregasService } from "./entregas.service";
import { CreateEntregasDto } from "./dto/create-entregas.dto";
import { UpdateEntregasDto } from "./dto/update-entregas.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Entrega } from "./entities/entregas.entity";
import { Auth } from "src/auth/decorator/auth.decorator";
import { GetUser } from "src/auth/decorator/get-user.decorator";
import { Usuario } from "src/auth/entities/user.entity";

@Controller("entregas")
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @Post()
  @ApiOperation({ summary: "Crear una nueva entrega" })
  @ApiResponse({ status: 201, description: "Entrega creada", type: Entrega })
  @ApiResponse({ status: 400, description: "Solicitud inválida" })
  create(@Body() createEntregaDto: CreateEntregasDto): Promise<Entrega> {
    return this.entregasService.create(createEntregaDto);
  }

  @Get()
  @ApiOperation({ summary: "Obtener todas las entregas" })
  @ApiResponse({
    status: 200,
    description: "Lista de entregas",
    type: [Entrega],
  })
  findAll(): Promise<Entrega[]> {
    return this.entregasService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una entrega por ID" })
  @ApiResponse({
    status: 200,
    description: "Entrega encontrada",
    type: Entrega,
  })
  @ApiResponse({ status: 404, description: "Entrega no encontrada" })
  findOne(@Param("id") id: string): Promise<Entrega> {
    return this.entregasService.findOne(id);
  }

  @Patch(":id")
  @Auth()
  @ApiOperation({ summary: "Actualizar una entrega" })
  @ApiResponse({
    status: 200,
    description: "Entrega actualizada",
    type: Entrega,
  })
  @ApiResponse({ status: 404, description: "Entrega no encontrada" })
  update(
    @Param("id") id: string,
    @Body() updateEntregaDto: UpdateEntregasDto
  ): Promise<Entrega> {
    return this.entregasService.update(id, updateEntregaDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar una entrega" })
  @ApiResponse({ status: 200, description: "Entrega eliminada" })
  @ApiResponse({ status: 404, description: "Entrega no encontrada" })
  remove(@Param("id") id: string): Promise<void> {
    return this.entregasService.remove(id);
  }
}
