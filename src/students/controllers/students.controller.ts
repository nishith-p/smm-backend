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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StudentsService } from '../services/students.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Request, Response } from 'express';
import { BaseController } from 'src/common/base.controller';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('students')
export class StudentsController extends BaseController {
  // /                       get, post
  // /:id                    get, put, delete

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
    const builder = await this.studentsService.findAllByQuery('students');

    //Search by Name
    if (req.query.s) {
      builder.where('students.name LIKE :s', { s: `%${req.query.s}%` });
    }

    //Pagination
    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = 25;
    const total = await builder.getCount();

    builder.offset((page - 1) * perPage).limit(perPage);

    const studentsObj = {
      data: await builder.getMany(),
      total: total,
      page: page,
      last_page: Math.ceil(total / perPage),
    };

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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fileObj = await this.studentsService.importExcel(file);

    return this.ok(res, fileObj);
  }
}
