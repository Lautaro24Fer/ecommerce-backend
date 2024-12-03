import { Address } from '../../address/entities/address.entity';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';
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

  @Column({ unique: true })
  paymentId: string;

  @ManyToOne(() => Address, (address) => address.id)
  address: Address;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  // @Column()
  // dev_date_estimated: Date;

  // @Column()
  // dev_date: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToMany(() => Product, (product) => product.id, { cascade: true })
  @JoinTable()
  products: Product[];
}
