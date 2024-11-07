import { Address } from 'src/address/entities/address.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Address, (address) => address.id)
  address: Address;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  // @Column()
  // method: string;

  // Method: [ TRANSACTION - EFECTIVO ]
  // Verifica si fue hecho con mercado pago o si quiere abonar en efectivo

  // @Column()
  // isPayed: boolean;
  // Verifica si la orden fue abonada o no (Pensando en que pueda pagar en efectivo con rapipago)

  @Column({ nullable: true })
  dev_date_estimated: Date;

  @Column({ nullable: true })
  dev_date: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToMany(() => Product, (product) => product.id)
  @JoinTable()
  products: Product[];
}
