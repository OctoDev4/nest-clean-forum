import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './jwt.strategy';






// Define um decorador personalizado chamado CurrentUser
export const CurrentUser = createParamDecorator(
  // Define a função que será executada quando o decorador CurrentUser for usado
  (_: never, context: ExecutionContext) => {
    // Obtém o objeto de requisição HTTP do contexto de execução
    const request = context.switchToHttp().getRequest();

    // Retorna o objeto de usuário a partir do objeto de requisição, assumindo que contém um campo "user" do tipo TokenPayload
    return request.user as UserPayload;
  },
);



