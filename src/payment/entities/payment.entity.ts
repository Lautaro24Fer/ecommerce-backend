import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment')
export class Payment{

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", default: "Bearer"})
	token_type:    string;
  
	@Column({ type: "varchar"})
	expires_in:    string;

	@Column({ type: "text"})
	access_token:  string;

	@Column({ type: "text"})
	refresh_token: string;
}