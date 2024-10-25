import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('identification_type')
export class IdType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
