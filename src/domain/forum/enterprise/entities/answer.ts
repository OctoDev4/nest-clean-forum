import { Entity } from '@/core/entities/entity'; // Importa a classe Entity
import { UniqueEntityId } from '@/core/entities/unique-entity-id'; // Importa a classe UniqueEntityId
import { Optional } from '@/core/types/optional';
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'; // Importa o tipo Optional

/**
 * Interface representando as propriedades de uma resposta.
 */
export interface AnswerProps {
  authorId: UniqueEntityId; // Identificador único do autor da resposta
  questionId: UniqueEntityId;
  attachments: AnswerAttachmentList;
  content: string; // Conteúdo da resposta
  createdAt: Date; // Data de criação da resposta
  updatedAt?: Date | null // Data de atualização da resposta (opcional)
}

/**
 * Classe representando uma resposta.
 */
export class Answer extends AggregateRoot<AnswerProps> {
  /**
   * Obtém o identificador único do autor da resposta.
   */
  get authorId() {
    return this.props.authorId;
  }

  /**
   * Obtém o identificador único da pergunta associada à resposta.
   */
  get questionId() {
    return this.props.questionId;
  }
  get attachments() {
    return this.props.attachments;
  }

  /**
   * Obtém o conteúdo da resposta.
   */
  get content() {
    return this.props.content;
  }

  /**
   * Obtém a data de criação da resposta.
   */
  get createdAt() {
    return this.props.createdAt;
  }

  /**
   * Obtém a data de atualização da resposta, se estiver disponível.
   */
  get updatedAt() {
    return this.props.updatedAt;
  }

  /**
   * Obtém um trecho do conteúdo da resposta.
   * O trecho contém os primeiros 120 caracteres do conteúdo, seguido de reticências.
   */
  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  /**
   * Atualiza o timestamp de updatedAt para o momento atual.
   * Método privado utilizado para atualizar a data de atualização da resposta.
   */
  private touch() {
    this.props.updatedAt = new Date();
  }

  /**
   * Define o conteúdo da resposta e atualiza o timestamp de updatedAt.
   * @param content O novo conteúdo da resposta.
   */
  set content(content: string) {
    this.props.content = content;
    this.touch(); // Chama o método touch para atualizar o timestamp de updatedAt
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments;
    this.touch(); // Chama o método touch para atualizar o timestamp de updatedAt
  }


  /**
   * Creates a new Answer object.
   *
   * @param {Optional<AnswerProps, 'createdAt' | 'attachments'>} props - Optional properties to set on the Answer object.
   * @param {UniqueEntityId} id - Optional UniqueEntityId to set on the Answer object.
   * @return {Answer} - The newly created Answer object.
   */
  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }
}
