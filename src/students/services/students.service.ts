import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { BaseController } from 'src/common/base.controller';
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
      throw new BadRequestException({
        success: false,
        error: error,
        data: null,
      });
    }
  }

  /**
   * Retrieve all students.
   */
  async findAll(): Promise<Student[]> {
    let successResponseData;

    successResponseData = await this.studentsRepo.find();

    if (!successResponseData) {
      const error = 'Bad Request';
      throw new BadRequestException({
        success: false,
        error: error,
        data: null,
      });
    }

    return successResponseData;
  }

  /**
   * Retrieve all students by query.
   */
  async findAllByQuery(alias: string) {
    let successResponseData;

    successResponseData = await this.studentsRepo.createQueryBuilder(alias);

    if (!successResponseData) {
      const error = 'Bad Request';
      throw new BadRequestException({
        success: false,
        error: error,
        data: null,
      });
    }

    return successResponseData;
  }

  /**
   * Retrieve a student by ID.
   */
  async findOne(id: number): Promise<Student> {
    let successResponseData;

    successResponseData = await this.studentsRepo.findOne({
      where: { id },
    });

    if (!successResponseData) {
      const error = 'Student does not exist';
      throw new NotFoundException({ success: false, error: error, data: null });
    }

    return successResponseData;
  }

  /**
   * Update a student by ID.
   */
  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    let successResponseData;
    let checkResponseData;

    const { name, email, dob, age } = updateStudentDto;

    checkResponseData = await this.findOne(id);

    try {
      checkResponseData.name = name;
      checkResponseData.email = email;
      checkResponseData.dob = dob;
      checkResponseData.age = age;

      successResponseData = await this.studentsRepo.save(checkResponseData);

      return successResponseData;
    } catch (error) {
      throw new BadRequestException({
        success: false,
        error: error,
        data: null,
      });
    }
  }

  /**
   * Remove a student by ID.
   */
  async remove(id: number): Promise<Student> {
    let successResponseData;
    let checkResponseData;

    checkResponseData = await this.findOne(id);

    try {
      successResponseData = await this.studentsRepo.remove(checkResponseData);

      return successResponseData;
    } catch (error) {
      throw new BadRequestException({
        success: false,
        error: error,
        data: null,
      });
    }
  }
}
