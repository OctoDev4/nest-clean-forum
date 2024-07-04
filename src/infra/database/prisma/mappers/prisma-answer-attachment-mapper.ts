// Importa o namespace Prisma e renomeia o tipo Attachment para PrismaAttachment
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

// Importa a classe AnswerAttachment do domínio da aplicação
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

// Importa a classe UniqueEntityId usada para criar IDs únicos
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

// Define a classe PrismaAnswerAttachmentMapper
export class PrismaAnswerAttachmentMapper {

  // Método estático para converter um PrismaAttachment para um AnswerAttachment
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    // Verifica se o raw contém um answerId, lança um erro se não contiver
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.')
    }

    // Cria uma instância de AnswerAttachment usando o método create
    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        answerId: new UniqueEntityId(raw.answerId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  // Método estático para criar os argumentos para uma atualização em massa no Prisma
  static toPrismaUpdateMany(
    attachments: AnswerAttachment[], // Recebe um array de AnswerAttachment
  ): Prisma.AttachmentUpdateManyArgs {
    // Mapeia os attachments para obter um array de IDs como strings
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    // Retorna um objeto AttachmentUpdateManyArgs para atualização em massa no Prisma
    return {
      where: {
        id: {
          in: attachmentIds, // Seleciona os registros cujos IDs estão no array attachmentIds
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(), // Define o answerId para atualização
      },
    }
  }
}
