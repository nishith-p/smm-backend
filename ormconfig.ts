import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';

require('dotenv').config();

const config: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE, 
  entities: [Student],
  synchronize: true,
};

export default config;
