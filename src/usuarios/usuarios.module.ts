import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports:[
    AuthModule
  ],
  exports:[
    UsuariosService
  ]
})
export class UsuariosModule {}
