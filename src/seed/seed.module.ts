import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService, AuthService],
  imports: [
    AuthModule,
  ],
  exports:[
    SeedService
  ]
})
export class SeedModule {}
