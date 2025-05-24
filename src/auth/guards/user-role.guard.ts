import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Usuario } from "../entities/user.entity";
import { META_ROL } from "../decorator/rol-protected.decorator";

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflactor: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRol: string[] = this.reflactor.get(
      META_ROL,
      context.getHandler()
    );

    if (!validRol) return true;
    if (validRol.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as Usuario;

    if (!user) {
      throw new BadRequestException("No existe el usuario");
    }

    if (!user.rols) {
      throw new BadRequestException("El rol del usuario no está definido");
    }

    if (validRol.includes(user.rols[0])) {
      return true;
    }
    throw new ForbiddenException(
      "El usuario no tiene el rol necesario para acceder a esta ruta"
    );
  }
}
