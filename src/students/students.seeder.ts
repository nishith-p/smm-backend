import { InjectRepository } from '@nestjs/typeorm';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

export class StudentSeeder implements Seeder {
  constructor(
    @InjectRepository(Student) private studentsRepo: Repository<Student>,
  ) {}

  seed(): Promise<any> {
    const students = DataFactory.createForClass(Student).generate(75);

    return this.studentsRepo.insert(students);
  }
  drop(): Promise<any> {
    return this.studentsRepo.delete({});
  }
}
