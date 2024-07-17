import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('supplier')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
