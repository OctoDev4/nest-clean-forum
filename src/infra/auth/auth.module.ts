import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '@/infra/env/env.service';
import { EnvModule } from '@/infra/env/env.module';


@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY')  // Obtém a chave privada do ambiente
        const publicKey = env.get('JWT_PUBLIC_KEY')  // Obtém a chave pública do ambiente

        return {
          signOptions: { algorithm: 'RS256' },  // Define o algoritmo de assinatura como RS256
          privateKey: Buffer.from(privateKey, 'base64'),  // Converte a chave privada de base64 para Buffer
          publicKey: Buffer.from(publicKey, 'base64'),  // Converte a chave pública de base64 para Buffer
        }
      },

    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
