import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { execFile } from 'child_process';
import { sign } from 'crypto';
import { Workbook } from 'exceljs';
import { createReadStream, createWriteStream } from 'fs';
import { userInfo } from 'os';
import { stringify } from 'querystring';
import readXlsxFile from 'read-excel-file';
import { BaseController } from 'src/common/base.controller';
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
   * Import Excel
   */
  async importExcel(file: Express.Multer.File) {
    try {
      if (file == undefined) {
        throw new BadRequestException();
      } else {
        let students = [];

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer).then(() => {
          var sheet = workbook.getWorksheet('Sheet1');
          console.log(sheet.actualRowCount);

          for (var i = 2; i <= sheet.actualRowCount; i++) {
            let student = {
              id: '',
              title: '',
              description: '',
              published: '',
            };

            for (var j = 1; j <= sheet.actualColumnCount; j++) {
              student[Object.keys(student)[j - 1]] = sheet
                .getRow(i)
                .getCell(j)
                .toString();
            }

            /**
             * Get DOB and subtract from current date
             * Assign it to student.dob
             */

            students.push(student);
          }

          //Write the DB code here
          console.log(students);
        });
      }
    } catch (error) {
      throw new BadRequestException({
        success: false,
        error: error,
        data: null,
      });
    }
  }
}
