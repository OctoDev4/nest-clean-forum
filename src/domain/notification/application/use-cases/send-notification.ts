import { Either, right } from '@/core/either';
import { Notification } from '@/domain/notification/enterprises/entities/notification';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    content,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      content,
      title,
    });

    await this.notificationsRepository.create(notification);

    return right({
      notification,
    });
  }
}
