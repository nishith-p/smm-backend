import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import config from 'ormconfig';
import { Student } from './entities/student.entity';
import { StudentSeeder } from './students.seeder';

seeder({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [Student],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Student]),
  ],
}).run([StudentSeeder]);
