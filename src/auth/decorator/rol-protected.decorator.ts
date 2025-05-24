import { SetMetadata } from '@nestjs/common';
import { Rol } from '../interfaces/valid-rol';


export const META_ROL = 'rol'

export const RolProtected = (...args: Rol[]) => {

    return SetMetadata(META_ROL, args);
}
