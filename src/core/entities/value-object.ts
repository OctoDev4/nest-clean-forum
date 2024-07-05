// Definição de uma classe abstrata ValueObject que utiliza um tipo genérico Props para suas propriedades
export abstract class ValueObject<Props> {

  // Propriedades do objeto de valor
  protected props: Props;

  // Construtor protegido que inicializa as propriedades do objeto de valor
  protected constructor(props: Props) {
    this.props = props;
  }

  // Método público equals para comparar dois objetos de valor
  public equals(vo: ValueObject<unknown>) {
    // Verifica se o objeto de valor comparado é nulo ou indefinido
    if (vo === null || vo === undefined) {
      return false;
    }
    // Verifica se as propriedades do objeto de valor comparado são indefinidas
    if (vo.props === undefined) {
      return false;
    }

    // Compara as propriedades dos dois objetos de valor utilizando JSON.stringify para verificar igualdade
    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}
