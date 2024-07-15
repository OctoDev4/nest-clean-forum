import { AggregateRoot } from '../entities/aggregate-root';
import { DomainEvent } from './domain-event';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

// Definindo o tipo para callbacks de eventos de domínio
type DomainEventCallback = (event: any) => void;

export class DomainEvents {
  // Um mapa para armazenar os handlers de eventos de domínio
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  // Uma lista para manter rastreio de agregados marcados para despacho de eventos
  private static markedAggregates: AggregateRoot<any>[] = [];

  public static shouldRun = true

  // Método para marcar um agregado para despacho de eventos
  public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
    // Verifica se o agregado já foi marcado
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    // Se não foi encontrado, adiciona à lista
    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  // Método para despachar eventos de um agregado
  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>) {
    // Itera sobre os eventos do agregado e os despacha
    aggregate.domainEvents.forEach((event: DomainEvent) =>
      this.dispatch(event),
    );
  }

  // Método para remover um agregado da lista de agregados marcados
  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<any>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

    // Remove o agregado da lista
    this.markedAggregates.splice(index, 1);
  }

  // Método para encontrar um agregado marcado pelo ID
  private static findMarkedAggregateByID(
    id: UniqueEntityId,
  ): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  // Método para despachar eventos para um agregado específico
  public static dispatchEventsForAggregate(id: UniqueEntityId) {
    const aggregate = this.findMarkedAggregateByID(id);

    // Se o agregado foi encontrado, despacha seus eventos
    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      // Limpa os eventos do agregado após despachá-los
      aggregate.clearEvents();
      // Remove o agregado da lista de agregados marcados
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  // Método para registrar um handler para um tipo de evento de domínio
  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    // Verifica se o evento já foi registrado anteriormente
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    // Se não foi registrado, cria uma entrada para ele no mapa
    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    // Adiciona o callback ao array de handlers para o evento específico
    this.handlersMap[eventClassName].push(callback);
  }

  // Método para limpar todos os handlers registrados
  public static clearHandlers() {
    this.handlersMap = {};
  }

  // Método para limpar a lista de agregados marcados
  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  // Método privado para despachar um evento de domínio
  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name;

    // Verifica se há handlers registrados para o tipo de evento
    const isEventRegistered = eventClassName in this.handlersMap;


    if (!this.shouldRun){
      return null
    }

    // Se houver handlers registrados, executa cada um deles para o evento
    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName];

      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
