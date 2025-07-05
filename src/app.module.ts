import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "./common/common.module";
import { AuthModule } from "./auth/auth.module";
import { UsuariosModule } from "./usuarios/usuarios.module";
import { SeedModule } from "./seed/seed.module";
import { MedicamentosModule } from "./medicamentos/medicamentos.module";
import { EntregasModule } from "./entregas/entregas.module";

@Module({
  imports: [
    ConfigModule.forRoot(),

function getSslOption() {
  const sslReject = process.env.SSL_REJECT_UNAUTHORIZED;
  if (sslReject === 'false') return { rejectUnauthorized: false };
  if (sslReject === 'true') return { rejectUnauthorized: true };
  return false; // 🔥 clave: no dejarlo como undefined
}

    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true,
  ssl: getSslOption(),
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
