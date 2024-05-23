import { Entity } from '@/core/entities/entity'; // Importa a classe Entity
import { UniqueEntityId } from '@/core/entities/unique-entity-id'; // Importa a classe UniqueEntityId

/**
 * Interface representando as propriedades de um instrutor.
 */
interface InstructorProps {
  name: string; // Nome do instrutor
}

/**
 * Classe representando um instrutor.
 */
export class Instructor extends Entity<InstructorProps> {
  /**
   * Cria uma nova instância de Instructor.
   * @param props Propriedades do instrutor.
   * @param id Identificador único do instrutor (opcional).
   * @returns Uma nova instância de Instructor.
   */
  static create(props: InstructorProps, id?: UniqueEntityId) {
    const instructor = new Instructor(
      {
        ...props,
      },
      id,
    );

    return instructor;
  }
}
