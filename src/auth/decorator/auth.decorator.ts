import { UseGuards, applyDecorators } from '@nestjs/common';
import { Rol } from './../interfaces/valid-rol';
import { RolProtected } from './rol-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';


export function Auth(...rols: Rol[]){
    return applyDecorators(
        RolProtected(...rols),
        UseGuards(AuthGuard(), UserRoleGuard)        
    )
}