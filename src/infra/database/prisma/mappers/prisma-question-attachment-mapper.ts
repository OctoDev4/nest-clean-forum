// Importa os tipos Prisma e PrismaAttachment do cliente Prisma
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';
// Importa a classe UniqueEntityId para gerenciar IDs únicos de entidades
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
// Importa a entidade QuestionAttachment que representa o vínculo entre perguntas e anexos
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

// Define a classe PrismaQuestionAttachmentMapper que fornece métodos de mapeamento entre Prisma e entidades de domínio
export class PrismaQuestionAttachmentMapper {
    // Método estático para converter um objeto PrismaAttachment em uma entidade QuestionAttachment
    static toDomain(raw: PrismaAttachment): QuestionAttachment {
        // Verifica se o attachment possui um questionId, pois é obrigatório para criar uma QuestionAttachment válida
        if (!raw.questionId) {
            // Lança um erro se o questionId estiver ausente, indicando um tipo de anexo inválido
            throw new Error('Invalid attachment type.');
        }

        // Cria e retorna uma entidade QuestionAttachment usando os dados do PrismaAttachment
        return QuestionAttachment.create(
          {
              // Cria um UniqueEntityId para o attachmentId usando o id do PrismaAttachment
              attachmentId: new UniqueEntityId(raw.id),
              // Cria um UniqueEntityId para o questionId usando o questionId do PrismaAttachment
              questionId: new UniqueEntityId(raw.questionId),
          },
          // Passa um UniqueEntityId para o id da entidade QuestionAttachment
          new UniqueEntityId(raw.id),
        );
    }

    // Método estático para converter uma lista de QuestionAttachment em um objeto Prisma.AttachmentUpdateManyArgs para atualização em massa
    static toPrismaUpdateMany(
      attachments: QuestionAttachment[],
    ): Prisma.AttachmentUpdateManyArgs {
        // Mapeia os IDs dos attachments para uma lista de strings
        const attachmentIds = attachments.map((attachment) => {
            // Converte o UniqueEntityId de cada attachment para uma string
            return attachment.attachmentId.toString();
        });

        // Retorna um objeto Prisma.AttachmentUpdateManyArgs configurado com os critérios de filtro e dados de atualização
        return {
            // Define o filtro where para selecionar attachments cujos IDs estão na lista de attachmentIds
            where: {
                id: {
                    in: attachmentIds,
                },
            },
            // Define os dados de atualização data para definir questionId de todos os attachments para o questionId do primeiro attachment na lista
            data: {
                questionId: attachments[0].questionId.toString(),
            },
        };
    }
}
