import { Address } from 'src/address/entities/address.entity';
import { LoginMethodType } from 'src/global/enum';
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

  @Column()
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 20 })
  phone: string;

  @ManyToOne(() => IdType, (m) => m.id)
  idType: IdType;

  @Column()
  idNumber: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: LoginMethodType, default: LoginMethodType.LOCAL })
  method: LoginMethodType;

  @ManyToMany(() => Address, (m) => m.user)
  @JoinTable()
  address: Address[];

  @ManyToMany(() => Role, (role) => role.id)
  @JoinTable()
  roles: Role[];

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetTokenExpiresIn?: Date;
}
