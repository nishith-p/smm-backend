import { Module } from '@nestjs/common';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { AppGateway } from 'src/app.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { BullModule } from '@nestjs/bull';
import { UploadConsumer } from './services/upload.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    BullModule.forRoot({ redis: { host: 'localhost', port: 5003 } }),
    BullModule.registerQueue({ name: 'import-queue' }),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, UploadConsumer, AppGateway],
})
export class StudentsModule {}
