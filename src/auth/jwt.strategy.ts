import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from 'src/env';
import { z } from 'zod';

// Definição do esquema de validação para o payload do token JWT
const tokenPayloadSchema = z.object({
    sub: z.string().uuid(), // O campo "sub" é uma string UUID
});

// Tipo inferido a partir do esquema de validação
export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService<Env, true>) {
        // Obter a chave pública JWT do ambiente usando o ConfigService
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

        // Chamar o construtor da superclasse (Strategy) com as opções necessárias
        super({
            // Extrair o token JWT do cabeçalho de autorização como um token Bearer
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Definir a chave pública como Buffer decodificada a partir da base64
            secretOrKey: Buffer.from(publicKey, 'base64'),
            // Definir os algoritmos de assinatura aceitos
            algorithms: ['RS256'],
        });
    }

    // Método de validação do payload do token
    async validate(payload: UserPayload) {
        // Validar o payload do token conforme o esquema definido
        return tokenPayloadSchema.parse(payload);
    }
}
