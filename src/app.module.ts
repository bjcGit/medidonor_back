import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SeedModule } from './seed/seed.module';
import { MedicamentosModule } from './medicamentos/medicamentos.module';
import { EntregasModule } from './entregas/entregas.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: true,
          ca: process.env.AIVEN_CA_CERT,
        },
      }),
    }),
    CommonModule,
    AuthModule,
    UsuariosModule,
    SeedModule,
    MedicamentosModule,
    EntregasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
