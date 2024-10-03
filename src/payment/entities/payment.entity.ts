import { Column, Entity } from "typeorm";

@Entity('payment')
export class Payment{

	@Column({ type: "varchar"})
	token_type:    string;
  
	@Column({ type: "varchar"})
	expires_in:    string;

	@Column({ type: "varchar"})
	access_token:  string;

	@Column({ type: "varchar"})
	refresh_token: string;
}