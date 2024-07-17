import { Brand } from 'src/brand/entities/brand.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => Brand, (brand) => brand.id)
  brand_id: Brand;

  @ManyToOne(() => Supplier, (supplier) => supplier.id)
  supplier_id: Supplier;
}
