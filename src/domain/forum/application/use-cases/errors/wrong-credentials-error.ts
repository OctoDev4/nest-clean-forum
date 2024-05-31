import { UseCaseError } from '@/core/errors/use-cases-error';

export class WrongCredentialsError extends Error implements UseCaseError{
  constructor() {
    super('credentials are not valid');
  }
}