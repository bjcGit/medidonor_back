import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Si la respuesta tiene paginación
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          Array.isArray(data.data) &&
          'total' in data &&
          'page' in data &&
          'skip' in data &&
          'limit' in data
        ) {
          return {
            ok: true,
            total: data.total,
            page: data.page,
            skip: data.skip,
            limit: data.limit,
            data: data.data,
            msg: null,
          };
        }
        // Respuesta simple
        return {
          ok: true,
          data,
          msg: null,
        };
      }),
    );
  }
}