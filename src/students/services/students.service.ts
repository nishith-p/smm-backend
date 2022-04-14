import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Student } from '../entities/student.entity';
const ExcelJS = require('exceljs');

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

  /**
   * Import Excel.
   */
  async importExcel(file: Express.Multer.File) {
    try {
      let students = [];
      let formattedDate;
      let currentAge;
      let workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(file.buffer).then(() => {
        let sheet = workbook.getWorksheet(1);

        for (let i = 2; i <= sheet.actualRowCount; i++) {
          let student = {
            name: '',
            email: '',
            dob: '',
            age: '',
          };

          formattedDate = moment(
            new Date(sheet.getRow(i).getCell(3).toString()),
          ).format('YYYY-MM-DD');

          currentAge = moment().diff(formattedDate, 'years');

          student.name = sheet.getRow(i).getCell(1).toString();
          student.email = sheet.getRow(i).getCell(2).toString();
          student.dob = formattedDate;
          student.age = currentAge.toString();

          students.push(student);
        }

        //Write the DB code here
        console.log(students);
      });
    } catch (error) {
      throw new BadRequestException({
        success: false,
        error: error.message,
        data: null,
      });
    }
  }
}
