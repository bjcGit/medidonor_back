import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permiso } from './entities/permisos.entity';
import { Route } from './entities/route.entity';

@Module({
  controllers: [RolesController],
  imports: [
    TypeOrmModule.forFeature([Role, Permiso, Route]),
  ],
  providers: [RolesService],
  exports: [RolesService, TypeOrmModule]
})
export class RolesModule {}
