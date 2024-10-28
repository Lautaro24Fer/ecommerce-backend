import { Address } from 'src/address/entities/address.entity';
import { IdType } from 'src/id-type/entities/id-type.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true })
  username: string;

  @ManyToOne(() => IdType, (m) => m.id, { cascade: true })
  idType: IdType;

  @Column()
  idNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'local' })
  method: string;

  @ManyToMany(() => Address, (m) => m.user, { cascade: true })
  @JoinTable()
  address: Address[];

  @ManyToMany(() => Role, (role) => role.id, { cascade: true })
  @JoinTable()
  roles: Role[];

  // Optionals

  // @Column({ nullable: true })
  // postalCode: string;

  // @Column({ nullable: true })
  // addressStreet?: string;

  // @Column({ nullable: true })
  // addressNumber?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetTokenExpiresIn?: Date;
}
