import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { StudentsService } from '../services/students.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Request, Response } from 'express';
import { BaseController } from 'src/common/base.controller';

@Controller('students')
export class StudentsController extends BaseController {
  constructor(private readonly studentsService: StudentsService) {
    super();
  }

  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const studentObj = await this.studentsService.create(createStudentDto);
    if (studentObj) {
      return this.created(res, studentObj);
    } else {
      return this.fail(res, studentObj);
    }
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const studentsObj = await this.studentsService.findAll();
    if (studentsObj) {
      return this.ok(res, studentsObj);
    } else {
      return this.notFound(res, studentsObj);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const studentObj = await this.studentsService.findOne(id);
    if (studentObj) {
      return this.ok(res, studentObj);
    } else {
      return this.notFound(res, studentObj);
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
  //   return this.studentsService.update(+id, updateStudentDto);
  // }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const studentObj = await this.studentsService.remove(+id);
    if (studentObj) {
      return this.ok(res, studentObj);
    } else {
      return this.notFound(res, studentObj);
    }
  }
}
