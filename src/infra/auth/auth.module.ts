import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Env } from '@/infra/env';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PassportModule, // Importa o módulo de autenticação Passport
    JwtModule.registerAsync({
      // Importa o módulo JWT de forma assíncrona
      global: true, // Define este módulo como global
      inject: [ConfigService], // Injeta o serviço de configuração do NestJS

      useFactory(config: ConfigService<Env, true>) {
        // Define uma fábrica para criar as opções do módulo JWT
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true }); // Obtém a chave privada JWT do serviço de configuração
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true }); // Obtém a chave pública JWT do serviço de configuração

        return {
          signOptions: { algorithm: 'RS256' }, // Define as opções de assinatura JWT com algoritmo RS256
          privateKey: Buffer.from(privateKey, 'base64'), // Converte a chave privada de base64 para Buffer
          publicKey: Buffer.from(publicKey, 'base64'), // Converte a chave pública de base64 para Buffer
        };
      },
    }),
  ],

  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Define o JwtAuthGuard como guarda de aplicação
    },
  ], // Define o JwtStrategy como provedor deste módulo
})
export class AuthModule {} // Exporta a classe AuthModule
