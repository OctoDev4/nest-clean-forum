import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';

// Definição da interface para o request do caso de uso EditQuestionUseCase
interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

// Definição do tipo de resposta do caso de uso EditQuestionUseCase
type EditQuestionUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>;

// Decorator que marca a classe como injetável no sistema de injeção de dependências do NestJS
@Injectable()
export class EditQuestionUseCase {
  constructor(
      private questionRepository: QuestionRepository,
      private questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  // Método principal que executa o caso de uso
  async execute({
                  authorId,
                  questionId,
                  title,
                  content,
                  attachmentsIds,
                }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    // Tenta encontrar a pergunta pelo ID
    const question = await this.questionRepository.findById(questionId);

    // Se a pergunta não for encontrada, retorna um erro de recurso não encontrado
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    // Se o autor da pergunta não for o mesmo que está tentando editar, retorna um erro de não permitido
    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    // Busca os anexos atuais da pergunta pelo ID da pergunta
    const currentQuestion =
        await this.questionAttachmentRepository.findManyByQuestionId(questionId);

    // Cria uma lista de anexos da pergunta
    const questionAttachmentList = new QuestionAttachmentList(currentQuestion);

    // Mapeia os IDs dos anexos recebidos no request para instâncias de QuestionAttachment
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });

    // Atualiza a lista de anexos da pergunta
    questionAttachmentList.update(questionAttachments);

    // Atualiza o título e o conteúdo da pergunta
    question.title = title;
    question.content = content;

    // Atualiza os anexos da pergunta
    question.attachments = questionAttachmentList;

    // Salva a pergunta atualizada no repositório
    await this.questionRepository.save(question);

    // Retorna um objeto vazio indicando sucesso
    return right({});
  }
}
