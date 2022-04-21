import { Process, Processor } from '@nestjs/bull';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';

@Processor('import-queue')
export class UploadProcessor {
  constructor(
    @InjectRepository(Student) private studentsRepo: Repository<Student>,
  ) {}

  @Process('upload-excel')
  async handleUploadFiles(job: Job) {
    let successResponseData;
    const csv = require('csvtojson');
    const csvFilePath = process.cwd() + '/' + job.data.file.path;

    console.log('HIT');

    try {
      console.log('HIT2');
      const studentList = await csv().fromFile(csvFilePath);
      await this.studentsRepo.save(studentList);
    } catch (error) {
      console.log(error);
    }
  }
}
