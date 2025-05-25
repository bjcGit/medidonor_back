import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Usuario } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorator/auth.decorator';


@ApiTags('medicamentos')
@Controller('medicamentos')
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) {}

  @Post()
  @ApiBearerAuth('token')
  @Auth()
  create(
    @Body() createMedicamentoDto: CreateMedicamentoDto, 
    @GetUser() user: Usuario
  ) {   
    console.log('Usuario en la ricues', user)
    return this.medicamentosService.create(createMedicamentoDto, user);
  }

  @Get()
  @ApiBearerAuth('token')
  findAll() {
    return this.medicamentosService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('token')
  findOne(@Param('id') id: string) {
    return this.medicamentosService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('token')
  @UseGuards()
  update(
    @Param('id') id: string, 
    @Body() updateMedicamentoDto: UpdateMedicamentoDto,
     @GetUser() user: Usuario
  ) {
    return this.medicamentosService.update(id, updateMedicamentoDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  remove(@Param('id') id: string) {
    return this.medicamentosService.remove(id);
  }
}