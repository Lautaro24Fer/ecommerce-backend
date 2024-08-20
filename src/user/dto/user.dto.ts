import { Role } from "src/roles/entities/role.entity";

export class UserDto {
  id: number;
  name: string;
  username: string;
  email: string;
  method: string;
  roles: Role[]
}
