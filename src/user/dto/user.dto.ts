import { Address } from "src/address/entities/address.entity";
import { Role } from "src/roles/entities/role.entity";

// MANEJO DEL USUARIO SIN CONTRASEÑAS Y DATOS SENSIBLES

export class UserDto {
  id: number;
  name: string;
  surname: string;
  username: string;
  phone: string;
  idNumber: string;
  address: Address[]
  email: string;
  method: string;
  roles: Role[]
}
