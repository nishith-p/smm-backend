import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentsRepo: Repository<Student>,
  ) {}

  /**
   * Create a student.
   */
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    let successResponseData;
    let passRequestData;

    const { name, email, dob, age } = createStudentDto;

    try {
      passRequestData = this.studentsRepo.create({
        name,
        email,
        dob,
        age,
      });

      successResponseData = await this.studentsRepo.save(passRequestData);

      return successResponseData;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  /**
   * Retrieve all students.
   */
  async findAll(): Promise<Student[]> {
    let successResponseData;

    try {
      successResponseData = await this.studentsRepo.find();

      return successResponseData;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  /**
   * Retrieve a student by ID.
   */
  async findOne(id: number): Promise<Student> {
    let successResponseData;

    try {
      successResponseData = await this.studentsRepo.findOneOrFail({
        where: { id },
      });

      return successResponseData;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  /**
   * Update a student by ID.
   */
  async update(id: number, updateStudentDto: UpdateStudentDto) {
    let errorResponseData;
    let successResponseData;
    let checkResponseData;

    const { name, email, dob, age } = updateStudentDto;

    try {
      checkResponseData = await this.studentsRepo.findOneOrFail({
        where: { id },
      });

      if (!checkResponseData) {
      }
    } catch (error) {}
  }

  /**
   * Remove a student by ID.
   */
  async remove(id: number): Promise<Student> {
    let successResponseData;
    let checkResponseData;

    try {
      checkResponseData = await this.studentsRepo.findOneOrFail({
        where: { id },
      });

      successResponseData = await this.studentsRepo.remove(checkResponseData);

      return successResponseData;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
