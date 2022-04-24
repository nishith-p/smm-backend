import { Process, Processor } from '@nestjs/bull';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import * as moment from 'moment';
import { AppGateway } from 'src/app.gateway';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
const ExcelJS = require('exceljs');

@Processor('import-queue')
export class UploadConsumer {
  constructor(
    @InjectRepository(Student) private studentsRepo: Repository<Student>,
    private gateway: AppGateway,
  ) {}

  @Process('import-excel')
  async uploadJob(job: Job) {
    try {
      let successResponseData;
      let students = [];
      let formattedDate;
      let currentAge;
      const excelFilePath = process.cwd() + '/' + job.data.file.path;

      let workbook = new ExcelJS.Workbook();

      await workbook.xlsx.readFile(excelFilePath).then(() => {
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
      });

      successResponseData = await this.studentsRepo
        .createQueryBuilder('students')
        .insert()
        .into(Student)
        .values(students)
        .execute();

      this.gateway.wss.emit('newUpload', { isComplete: true });

      return successResponseData;
    } catch (error) {
      this.gateway.wss.emit('newUpload', { isComplete: false });

      throw new BadRequestException({
        success: false,
        error: error.message,
        data: null,
      });
    }
  }
}
