import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

// Interface para a requisição do caso de uso FetchQuestionCommentsUseCase
interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

// Tipo para a resposta do caso de uso FetchQuestionCommentsUseCase
type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

// Decorador Injectable para que a classe possa ser injetada em outros componentes no NestJS
@Injectable()
// Definição da classe FetchQuestionCommentsUseCase
export class FetchQuestionCommentsUseCase {
  // Construtor que recebe um repositório de comentários de perguntas
  constructor(private questionCommentsRepository: QuestionCommentRepository) {}

  // Método assíncrono execute que processa a requisição e retorna a resposta
  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    // Busca os comentários da pergunta com as informações dos autores usando o repositório
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        });

    // Retorna os comentários dentro de um objeto Either, utilizando a função right para indicar sucesso
    return right({
      comments,
    });
  }
}
