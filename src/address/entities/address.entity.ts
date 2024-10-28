import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("address")
export class Address {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  postalCode: string;

  @Column({ length: 30 })
  addressStreet: string;

  @Column({ length: 6 })
  addressNumber: string;

  @ManyToMany(() => User, (user) => user.address)
  user: User[];
}
