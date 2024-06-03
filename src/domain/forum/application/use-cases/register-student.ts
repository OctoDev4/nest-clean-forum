import { Either, left, right } from '@/core/either';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';

interface RegisterStudentUseCaseRequest{
  name: string;
  email: string;
  password: string;
}


type RegisterStudentUseCaseResponse = Either<StudentAlreadyExistsError, {
    student: Student;
}>


@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({ name, email, password }: RegisterStudentUseCaseRequest):Promise<RegisterStudentUseCaseResponse>{


    const studentWithSameEmail = await this.studentRepository.findByEmail(email)

    if(studentWithSameEmail){
      return left(new StudentAlreadyExistsError(email))
    }

    const hashPassword = await this.hashGenerator.hash(password)


    const student = Student.create({
      name,
      email,
      password: hashPassword,
    })

    await this.studentRepository.create(student)



    return right({
      student
    })


  }
}
