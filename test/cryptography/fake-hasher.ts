// Importa as interfaces HashGenerator e HashComparer do módulo de criptografia.
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/forum/application/cryptography/hash.comparer';

// Define a classe FakeHasher que implementa as interfaces HashGenerator e HashComparer.
export class FakeHasher implements HashGenerator, HashComparer {

  // Método assíncrono que gera um hash a partir de uma string plana.
  // Neste caso, ele apenas concatena '-hashed' à string original.
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  // Método assíncrono que compara uma string plana com um hash.
  // Neste caso, ele verifica se a string plana concatenada com '-hashed' é igual ao hash fornecido.
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
