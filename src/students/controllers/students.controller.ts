import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Res,
  Put,
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

    return this.created(res, studentObj);
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const studentsObj = await this.studentsService.findAll();

    return this.ok(res, studentsObj);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, req: Request, @Res() res: Response) {
    const studentObj = await this.studentsService.findOne(id);

    return this.ok(res, studentObj);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStudentDto: UpdateStudentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const studentObj = await this.studentsService.update(id, updateStudentDto);

    return this.ok(res, studentObj);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const studentObj = await this.studentsService.remove(+id);

    return this.ok(res, studentObj);
  }
}
