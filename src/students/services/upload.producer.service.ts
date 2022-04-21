import { InjectQueue } from '@nestjs/bull';
import { Injectable, UploadedFile } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class UploadProducerService {
  constructor(@InjectQueue('import-queue') private queue: Queue) {}

  async uploadExcel(@UploadedFile() file) {
    await this.queue.add('import-excel', { file: file });
  }
}
