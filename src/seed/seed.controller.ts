import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

 

  @Get()
  procesarArchivoJSON() {
    return this.seedService.procesarArchivoJSON();
  }

  @Post('load-users')
  async loadUsers() {
    await this.seedService.procesarArchivoJSON();
    return { message: 'Carga masiva de usuarios completada' };
  }

  @Post('load-depen')
  async loadDepen() {
    await this.seedService.procesarArchivoJSONDepe();
    return { message: 'Carga masiva de dependencias completada' };
  }


}
