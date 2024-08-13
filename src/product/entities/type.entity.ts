import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('product_type')
export class ProductType{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string;
}