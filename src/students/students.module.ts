import { Module } from '@nestjs/common';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { BullModule } from '@nestjs/bull';
import { UploadController } from './controllers/upload.controller';
import { UploadProducerService } from './services/upload.producer.service';
import { UploadConsumer } from './services/upload.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    BullModule.forRoot({ redis: { host: 'localhost', port: 5003 } }),
    BullModule.registerQueue({ name: 'import-queue' }),
  ],
  controllers: [StudentsController, UploadController],
  providers: [StudentsService, UploadProducerService, UploadConsumer],
})
export class StudentsModule {}
