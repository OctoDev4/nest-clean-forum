import { Module } from '@nestjs/common';
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { HashComparer } from '@/domain/forum/application/cryptography/hash.comparer';

@Module({

  providers:[
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
  ],
  exports:[
    Encrypter,
    HashGenerator,
    HashComparer
  ]

})
export class CryptographyModule{


}