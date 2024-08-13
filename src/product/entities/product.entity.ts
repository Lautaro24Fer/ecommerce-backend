import { Brand } from 'src/brand/entities/brand.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductType } from './type.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => ProductType, (type) => type.id, { cascade: true })
  type: ProductType

  @ManyToOne(() => Brand, (brand) => brand.id, { cascade: true })
  brand: Brand;

  @ManyToOne(() => Supplier, (supplier) => supplier.id, { cascade: true })
  supplier: Supplier;
}
