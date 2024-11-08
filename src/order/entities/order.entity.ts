import { Address } from 'src/address/entities/address.entity';
import { MethodPaymentType } from 'src/global/enum';
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

  @Column({ nullable: true })
  dev_date_estimated: Date;

  @Column({ nullable: true })
  dev_date: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToMany(() => Product, (product) => product.id)
  @JoinTable()
  products: Product[];

  // Informacion del pago

  @Column({ type: 'enum', enum: MethodPaymentType, default: MethodPaymentType.MERCADO_PAGO })
  paymentMethod: MethodPaymentType;

  @Column({ type: 'boolean', default: false })
  isPayed: boolean; 

  @Column({ type: 'timestamp', nullable: true })
  date_payed: Date;

  @Column({ nullable: true })
  installments: number;
}
