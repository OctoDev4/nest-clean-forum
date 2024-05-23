import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  /**
   * Transforms a given value using the schema parse method.
   *
   * @param {unknown} value - The value to be transformed.
   *
   * @return {unknown} - The transformed value.
   *
   * @throws {BadRequestException} - If the schema parse method throws an error of type ZodError, a BadRequestException is thrown with a message, status code, and errors.
   *
   * @throws {BadRequestException} - If the schema parse method throws any other error besides ZodError, a BadRequestException is thrown with a default message.
   */
  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        });
      }

      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
