import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadProducerService } from '../services/upload.producer.service';

@Controller('excel')
export class UploadController {
  constructor(private readonly uploadProducerService: UploadProducerService) {}

  // @Get('message')
  // sendMessage(@Query('msg') msg: string) {
  //   this.uploadProducerService.sendMessage(msg);
  //   return msg;
  // }
  // constructor(@InjectQueue('import-queue') private queue: Queue) {}

  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './files',
  //       filename: (req, file, cb) => {
  //         const randomName = Date.now();

  //         cb(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  // async uploadExcel(@UploadedFile() file) {
  //   console.log(file);
  //   this.queue.add('upload-excel', { file: file });
  // }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const randomName = Date.now();

          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadExcel(@UploadedFile() file) {
    await this.uploadProducerService.uploadExcel(file);
    return 'Success';
  }
}
