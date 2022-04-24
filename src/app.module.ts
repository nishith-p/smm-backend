import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), StudentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
