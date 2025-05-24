import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { SeedModule } from './seed/seed.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({   
      type: 'postgres',
      host: process.env.PD_HOST,
      port: +process.env.PD_PORT,
      username: process.env.PD_USERNAME,
      password: process.env.PD_PASSWORD,
      database: process.env.PD_NAMEDB,
      autoLoadEntities: true,
      synchronize: true,
    }),

    CommonModule,   
    AuthModule,
    UsuariosModule,
    RolesModule,
    SeedModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
