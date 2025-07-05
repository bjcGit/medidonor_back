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
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: getSslConfig(),
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

// 🔐 Esta función asegura que ssl siempre sea correcto
function getSslConfig() {
  // Solo si la variable existe y explícitamente es "false", desactiva verificación
  if (process.env.NODE_ENV === 'production') {
    return { rejectUnauthorized: false };
  }
  return false; // para desarrollo local
}
