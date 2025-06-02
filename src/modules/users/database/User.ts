import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  // ForeignKey,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  /*@ForeignKey()
  tenant_id!: number; //number[] car peut appartenir à plusieurs tenants ?*/
}
