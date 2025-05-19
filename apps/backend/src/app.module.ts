import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '../../../../.env'),
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'joaomarcelino',
      password: process.env.POSTGRES_PASSWORD || '102030',
      database: process.env.POSTGRES_DB || 'new',
      entities: [User, Task],
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
