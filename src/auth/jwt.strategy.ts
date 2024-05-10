import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";
import { z } from "zod";
import { Injectable } from "@nestjs/common";

// Define um esquema Zod para validar o payload do token JWT
const tokenPayloadSchema = z.object({
    sub: z.string().uuid() // Define uma propriedade "sub" como uma string UUID
});

// Define o tipo TokenPayload como o tipo inferido do esquema Zod
export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

// Define a classe JwtStrategy como uma estratégia de autenticação Passport
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService<Env, true>) {
        // Obtém a chave pública JWT do serviço de configuração
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

        // Chama o construtor da classe PassportStrategy com as opções da estratégia JWT
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token JWT do cabeçalho de autorização Bearer
            secretOrKey: Buffer.from(publicKey, 'base64'), // Define a chave pública JWT como segredo para verificação
            algorithms: ['RS256'] // Define os algoritmos suportados para decodificação do token
        });
    }

    // Método de validação do token JWT
    async validate(payload: TokenPayload) {
        // Valida o payload do token usando o esquema Zod
        return tokenPayloadSchema.parse(payload);
    }
}
