import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: 'local' })
  method: string;

  @ManyToMany(() => Role, (role) => role.id, { cascade: true })
  @JoinTable()
  roles: Role[];
}
