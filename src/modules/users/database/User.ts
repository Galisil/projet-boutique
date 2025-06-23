import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { Tenant } from "../../tenants/database/Tenant";

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

  // @ManyToOne(() => Tenant, { nullable: false })
  // @JoinColumn({ name: "tenant_id" })
  // tenant!: Tenant; // tenant principal

  @ManyToMany(() => Tenant, (tenant) => tenant.users, { cascade: true })
  @JoinTable({
    name: "user_tenants",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tenant_id", referencedColumnName: "id" },
  })
  tenants!: Tenant[];
  /*@ForeignKey()
  tenant_id!: number; //number[] car peut appartenir à plusieurs tenants ?*/
}
