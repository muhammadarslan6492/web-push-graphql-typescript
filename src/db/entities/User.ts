import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Notification } from "./Notification";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  @JoinColumn({ name: "user_id" }) // Name of the foreign key column in the Notification table
  notifications: Notification[] = [];
}
