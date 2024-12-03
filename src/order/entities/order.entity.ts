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

  @Column()
  destinity: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  // @Column()
  // dev_date_estimated: Date;

  // @Column()
  // dev_date: Date;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  user: User;

  @ManyToMany(() => Product, (product) => product.id, { cascade: true })
  @JoinTable()
  products: Product[];

  @Column({ type: 'varchar', default: "MP_TRANSFER" })
  paymentMethod: string;

  // @Column({ type: 'number', default: 21 })
  // IVA: number;
}
