import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export function handleCustomError(error: any): never {
  // Error de duplicidad
  if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('duplicate')) {
    throw new BadRequestException('Ya existe este registro');
  }

  // Error de dato no encontrado
  if (error instanceof NotFoundException || error.message?.includes('No existe') || error.message?.includes('not found')) {
    throw new NotFoundException(error.message || 'No se encontró el recurso solicitado');
  }

  // Error de validación de campos obligatorios (class-validator)
  if (error instanceof BadRequestException) {
    const response = error.getResponse?.();
    if (response && Array.isArray((response as any).message)) {
      throw new BadRequestException((response as any).message);
    }
  }

  // Error de validación de base de datos
  if (error.name === 'QueryFailedError' && error.message?.includes('cannot be null')) {
    throw new BadRequestException('Faltan datos obligatorios');
  }

  // Otros errores personalizados
  if (error.response && error.response.message) {
    throw new BadRequestException(error.response.message);
  }

  // Error genérico
  throw new InternalServerErrorException('Revisa los logs del servidor');
}