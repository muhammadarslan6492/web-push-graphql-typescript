import { DataSource } from "typeorm";
import { Notification } from "./entities/Notification";
import { User } from "./entities/User";
import dotenv from "dotenv";

dotenv.config();

export default new DataSource({
  entities: [User, Notification],
  type: "postgres",
  url: "postgresql://postgres:postgres@localhost:5432/postgres",
  synchronize: true,
});
