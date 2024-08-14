import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";

@Entity('product_image')
export class ProductImage{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', unique: true})
    url: string;

    @Column({ default: false })
    isMain: boolean;

    @ManyToOne(() => Product, (product) => product.id, { cascade: true })
    product: Product;
}