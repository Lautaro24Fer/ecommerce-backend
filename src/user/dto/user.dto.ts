import { IdType } from "src/id-type/entities/id-type.entity";
import { Role } from "src/roles/entities/role.entity";

export class UserDto {
  id: number;
  name: string;
  surname: string;
  username: string;
  postalCode: string;
  idType: IdType;
  idNumber: string;
  addressStreet?: string;
  addressNumber?: string;
  email: string;
  method: string;
  roles: Role[]
}
