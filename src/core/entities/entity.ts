import { randomUUID } from 'node:crypto'; // Importa a função randomUUID do módulo crypto do Node.js
import { UniqueEntityId } from '@/core/entities/unique-entity-id'; // Importa a classe UniqueEntityId

/**
 * Classe genérica para representar entidades do domínio.
 * Uma entidade possui uma identidade única e um conjunto de propriedades.
 */
export class Entity<Props> {
  private _id: UniqueEntityId; // Identificador único da entidade
  protected props: any; // Propriedades da entidade

  /**
   * Obtém o identificador único da entidade.
   * @returns O identificador único da entidade.
   */
  get id() {
    return this._id;
  }

  /**
   * Construtor da classe Entity.
   * @param props Propriedades da entidade.
   * @param id Identificador único da entidade (opcional). Se não fornecido, um novo identificador único será gerado automaticamente.
   */
  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props; // Define as propriedades da entidade
    this._id = id ?? new UniqueEntityId(randomUUID()); // Define o identificador único da entidade. Se não fornecido, gera um novo identificador único.
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true;
    }

    if (entity.id === this._id) {
      return true;
    }

    return false;
  }
}
