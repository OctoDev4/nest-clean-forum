export class Left<L, R> {
  // Define uma propriedade somente leitura "value" do tipo L (genérico)
  readonly value: L;

  // Construtor que aceita um valor do tipo L
  constructor(value: L) {
    // Atribui o valor ao atributo "value"
    this.value = value;
  }

  // Método que verifica se a instância é do tipo Right
  isRight(): this is Right<L, R> {
    // Sempre retorna false, pois esta é a classe Left
    return false;
  }

  // Método que verifica se a instância é do tipo Left
  isLeft(): this is Left<L, R> {
    // Sempre retorna true, pois esta é a classe Left
    return true;
  }
}

// Define a classe Right (direita)
export class Right<L, R> {
  // Define uma propriedade somente leitura "value" do tipo R (genérico)
  readonly value: R;

  // Construtor que aceita um valor do tipo R
  constructor(value: R) {
    // Atribui o valor ao atributo "value"
    this.value = value;
  }

  // Método que verifica se a instância é do tipo Right
  isRight(): this is Right<L, R> {
    // Sempre retorna true, pois esta é a classe Right
    return true;
  }

  // Método que verifica se a instância é do tipo Left
  isLeft(): this is Left<L, R> {
    // Sempre retorna false, pois esta é a classe Right
    return false;
  }
}

// Define um tipo "Either" que pode ser Left<L> ou Right<R>
export type Either<L, R> = Left<L, R> | Right<L, R>;

// Função left que cria uma instância de Left<L>
export const left = <L, R>(value: L): Either<L, R> => {
  // Retorna uma nova instância de Left com o valor fornecido
  return new Left(value);
};

// Função right que cria uma instância de Right<R>
export const right = <L, R>(value: R): Either<L, R> => {
  // Retorna uma nova instância de Right com o valor fornecido
  return new Right(value);
};
