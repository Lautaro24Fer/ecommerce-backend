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

  @Column({ unique: true })
  paymentId: string;

  @ManyToOne(() => Address, (address) => address.id)
  address: Address;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ nullable: true })
  devDateEstimated: Date; // Se actualiza manualmente

  @Column({ nullable: true })
  devDate: Date; // Se actualiza manualmente

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToMany(() => Product, (product) => product.id, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  productOrder: ProductOrder[];

  // Informacion del pago

  @Column({ type: 'varchar', default: "mercadopago" })
  paymentMethod: string;

  @Column({ type: 'boolean', default: false })
  isPayed: boolean; // Se actualiza mediante webhook

  @Column({ type: 'timestamp', nullable: true })
  datePayed: Date; // Se actualiza mediante webhook

  @Column({ nullable: true })
  installments: number;
}

@Entity('product-order')
export class ProductOrder {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.productOrder)
  order: Order;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
