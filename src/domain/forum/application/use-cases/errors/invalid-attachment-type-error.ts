import { UseCaseError } from '@/core/errors/use-cases-error';

export class InvalidAttachmentTypeError extends Error implements UseCaseError{
  constructor(type: string) {
    super(`file type ${type} is not supported `);
  }
}