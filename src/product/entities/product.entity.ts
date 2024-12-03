import { Brand } from 'src/brand/entities/brand.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductType } from '../../type/entities/type.entity';
import { ProductImage } from 'src/images/entities/image.entity';

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

  @Column({ type: 'text' })
  image: string;

  @OneToMany(() => ProductImage, (image) => image.product, { onDelete: 'CASCADE' })
  secondariesImages: ProductImage[]

  @ManyToOne(() => ProductType, (type) => type.id, { cascade: true })
  type: ProductType;

  @ManyToOne(() => Brand, (brand) => brand.id, { cascade: true })
  brand: Brand;

  @ManyToOne(() => Supplier, (supplier) => supplier.id, { cascade: true })
  supplier: Supplier;
}

/*
@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number; // Precio base del producto

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 21 })
  vatPercentage: number; // IVA en porcentaje (por defecto 21%)

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  profitMargin: number; // Margen de ganancia en porcentaje

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number; // Costo del producto (opcional para calcular ganancias netas)

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  image: string;

  @OneToMany(() => ProductImage, (image) => image.product, { onDelete: 'CASCADE' })
  secondariesImages: ProductImage[]

  @ManyToOne(() => ProductType, (type) => type.id, { cascade: true })
  type: ProductType;

  @ManyToOne(() => Brand, (brand) => brand.id, { cascade: true })
  brand: Brand;

  @ManyToOne(() => Supplier, (supplier) => supplier.id, { cascade: true })
  supplier: Supplier;
}
*/
