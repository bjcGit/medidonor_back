import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(

  ) {}

  async procesarArchivoJSON(batchSize: number = 100): Promise<void> {
    try {

      console.log('Inserción masiva completada');
    } catch (error) {
      console.error('Error procesando el archivo:', error.message);
      throw new Error('No se pudo procesar el archivo JSON');
    }
  }
  async procesarArchivoJSONDepe(batchSize: number = 100): Promise<void> {
    try {

      console.log('Inserción masiva completada');
    } catch (error) {
      console.error('Error procesando el archivo:', error.message);
      throw new Error('No se pudo procesar el archivo JSON');
    }
  }

}
