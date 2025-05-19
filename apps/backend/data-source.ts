import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Task } from './src/tasks/task.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'joaomarcelino',
  password: process.env.POSTGRES_PASSWORD || '102030',
  database: process.env.POSTGRES_DB || 'new',
  entities: [User, Task],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: false,
});
