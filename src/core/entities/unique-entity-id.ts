import { randomUUID } from 'node:crypto'; // Importa a função randomUUID do módulo crypto do Node.js

/**
 * Classe para representar um identificador único de entidade.
 */
export class UniqueEntityId {
  private value: string; // Valor do identificador único

  /**
   * Obtém uma representação em string do identificador único.
   * @returns Uma representação em string do identificador único.
   */
  toString() {
    return this.value;
  }

  /**
   * Obtém o valor do identificador único.
   * @returns O valor do identificador único.
   */
  toValue() {
    return this.value;
  }

  /**
   * Construtor da classe UniqueEntityId.
   * Se nenhum valor for fornecido, um novo identificador único será gerado automaticamente.
   * @param value O valor do identificador único (opcional).
   */
  constructor(value?: string) {
    // Se nenhum valor for fornecido, gera um novo identificador único usando randomUUID()
    this.value = value ?? randomUUID();
  }

  public equals(id: UniqueEntityId) {
    return id.toValue() === this.value;
  }
}
