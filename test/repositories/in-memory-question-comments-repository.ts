import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentRepository } from './in-memory-student-repository';

// Definição da classe InMemoryQuestionCommentsRepository que implementa a interface QuestionCommentRepository
export class InMemoryQuestionCommentsRepository implements QuestionCommentRepository {
  // Lista de comentários em memória
  public items: QuestionComment[] = [];

  // Construtor que recebe um repositório de estudantes em memória
  constructor(private studentsRepository: InMemoryStudentRepository) {}

  // Método assíncrono para encontrar um comentário pelo seu ID
  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    // Retorna o comentário encontrado ou null se não encontrado
    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  // Método assíncrono para encontrar vários comentários por ID de pergunta, com paginação
  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  // Método assíncrono para criar um novo comentário
  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);

    // Despacha eventos de domínio para o agregado de comentário
    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  // Método assíncrono para deletar um comentário
  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );
    this.items.splice(itemIndex, 1);
  }

  // Método assíncrono para encontrar vários comentários por ID de pergunta com informações do autor, com paginação
  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        // Encontra o autor do comentário no repositório de estudantes
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId);
        });

        // Lança um erro se o autor não for encontrado
        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exist.`,
          );
        }

        // Cria um objeto CommentWithAuthor com as informações do comentário e do autor
        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        });
      });

    return questionComments;

  }
}
