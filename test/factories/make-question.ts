// Importando as dependências necessárias
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { faker } from '@faker-js/faker'; // Adicionando a importação do faker

// Definindo a função MakeQuestion que recebe um objeto Partial<QuestionProps> como argumento opcional
// e um argumento opcional id do tipo UniqueEntityId
export function MakeQuestion(
  override: Partial<QuestionProps> = {}, // Definindo override como um objeto parcial de QuestionProps
  id?: UniqueEntityId, // Permitindo que id seja opcional e seja do tipo UniqueEntityId
) {
  // Criando uma instância de Question utilizando a função estática create do tipo Question
  // passando um objeto com propriedades authorId, title, content, e quaisquer propriedades adicionais especificadas em override
  // e opcionalmente passando um id
  const question = Question.create(
    {
      authorId: new UniqueEntityId(), // Criando uma nova instância de UniqueEntityId como authorId
      title: faker.lorem.sentence(), // Utilizando faker para gerar um título aleatório
      content: faker.lorem.text(), // Utilizando faker para gerar conteúdo de pergunta aleatório

      ...override, // Sobrescrevendo as propriedades padrão com qualquer propriedade fornecida em override
    },
    id,
  ); // Passando o id opcional para a criação da instância de Question

  return question; // Retornando a instância de Question criada
}
