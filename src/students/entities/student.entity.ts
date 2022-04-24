import { Factory } from 'nestjs-seeder';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Faker, faker } from '@faker-js/faker';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Factory((Faker) => faker.name.findName())
  @Column()
  name: string;

  @Factory((Faker) => faker.internet.email())
  @Column()
  email: string;

  @Factory((Faker) => faker.name.firstName())
  @Column()
  dob: string;

  @Factory((Faker) => faker.name.firstName())
  @Column()
  age: string;
}
