// Importa a interface QuestionRepository e a entidade Question
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';

// Implementa a interface QuestionRepository com um repositório de perguntas em memória
export class InMemoryQuestionsRepository implements QuestionRepository {
  // Array para armazenar as perguntas em memória
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentRepository,
  ) {}

  // Método para encontrar uma pergunta pelo ID
  async findById(id: string) {
    // Procura a pergunta com o ID fornecido no array de perguntas
    const question = this.items.find((item) => item.id.toString() === id);

    // Se a pergunta não for encontrada, lança um erro
    if (!question) {
      throw new Error('question not found');
    }

    // Retorna a pergunta encontrada
    return question;
  }

  // Método para encontrar uma pergunta pelo slug
  async findBySlug(slug: string) {
    // Procura a pergunta com o slug fornecido no array de perguntas
    const question = this.items.find((item) => item.slug.value === slug);

    // Se a pergunta não for encontrada, retorna null
    if (!question) {
      return null;
    }

    // Retorna a pergunta encontrada
    return question;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  // Método para criar uma nova pergunta
  async create(question: Question) {
    // Adiciona a nova pergunta ao array de perguntas
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  // Método para salvar uma pergunta existente
  async save(question: Question) {
    // Encontra o índice da pergunta no array de perguntas
    const itemsIndex = this.items.findIndex((item) => item.id === question.id);

    // Substitui a pergunta existente pela pergunta atualizada
    this.items[itemsIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  // Método para excluir uma pergunta
  async delete(question: Question) {
    // Encontra o índice da pergunta no array de perguntas
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    // Remove a pergunta do array
    this.items.splice(itemIndex, 1);

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }
}
