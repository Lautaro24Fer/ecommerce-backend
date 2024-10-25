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

  @Column()
  postalCode: string;

  @ManyToOne(() => IdType, (m) => m.id, { cascade: true })
  idType: IdType;

  @Column()
  idNumber: string;

  @Column({ nullable: true })
  addressStreet?: string;

  @Column({ nullable: true })
  addressNumber?: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: 'local' })
  method: string;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetTokenExpiresIn?: Date;

  @ManyToMany(() => Role, (role) => role.id, { cascade: true })
  @JoinTable()
  roles: Role[];
}
