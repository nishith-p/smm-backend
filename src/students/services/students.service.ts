import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseHandler } from 'src/helpers/response.helper';
import { Repository } from 'typeorm';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentsService extends ResponseHandler {
  constructor(
    @InjectRepository(Student) private studentsRepo: Repository<Student>,
  ) {
    super();
  }

  async create(createStudentDto: CreateStudentDto) {
    let errorResponseData;
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
      return this.ok(successResponseData);
    } catch (error) {
      errorResponseData = error.message;
      return this.fail(errorResponseData);
    }
  }

  async findAll() {
    let errorResponseData;
    let successResponseData;

    try {
      successResponseData = await this.studentsRepo.find();
      return this.ok(successResponseData);
    } catch (error) {
      errorResponseData = error.message;
      return this.fail(errorResponseData);
    }
  }

  async findOne(id: number) {
    let errorResponseData;
    let successResponseData;

    try {
      successResponseData = await this.studentsRepo.findOneOrFail({
        where: { id },
      });

      if (!successResponseData) {
        return this.fail(successResponseData);
      }

      return this.ok(successResponseData);
    } catch (error) {
      errorResponseData = error.message;
      return this.fail(errorResponseData);
    }
  }

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
        return this.fail(checkResponseData);
      }
    } catch (error) {}
  }

  async remove(id: number) {
    let errorResponseData;
    let successResponseData;
    let checkResponseData;

    try {
      checkResponseData = await this.studentsRepo.findOneOrFail({
        where: { id },
      });

      if (!checkResponseData) {
        return this.fail(checkResponseData);
      }

      successResponseData = await this.studentsRepo.remove(checkResponseData);
      return this.ok(successResponseData);
    } catch (error) {
      errorResponseData = error.message;
      return this.fail(errorResponseData);
    }
  }
}
