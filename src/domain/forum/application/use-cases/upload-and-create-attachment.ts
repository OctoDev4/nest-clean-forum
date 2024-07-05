// Importa o tipo Either e suas funções left e right para manipulação de resultados
import { Either, left, right } from '@/core/either';
// Importa o decorador Injectable do NestJS
import { Injectable } from '@nestjs/common';
// Importa o erro personalizado InvalidAttachmentTypeError
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';
// Importa a entidade Attachment
import { Attachment } from '../../enterprise/entities/attachment';
// Importa o repositório de anexos
import { AttachmentsRepository } from '../repositories/attachments-repository';
// Importa o serviço de upload
import { Uploader } from '../storage/uploader';

// Interface para a requisição do caso de uso UploadAndCreateAttachmentUseCase
interface UploadAndCreateAttachmentRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

// Tipo para a resposta do caso de uso UploadAndCreateAttachmentUseCase
type UploadAndCreateAttachmentResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>;

// Decorador Injectable para que a classe possa ser injetada em outros componentes no NestJS
@Injectable()
// Definição da classe UploadAndCreateAttachmentUseCase
export class UploadAndCreateAttachmentUseCase {
  // Construtor que recebe um repositório de anexos e um serviço de upload
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  // Método assíncrono execute que processa a requisição e retorna a resposta
  async execute({
                  fileName,
                  fileType,
                  body,
                }: UploadAndCreateAttachmentRequest): Promise<UploadAndCreateAttachmentResponse> {
    // Verifica se o tipo de arquivo é válido (JPEG, PNG ou PDF)
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      // Retorna um erro de tipo de anexo inválido se o tipo não for válido
      return left(new InvalidAttachmentTypeError(fileType));
    }

    // Realiza o upload do arquivo e obtém a URL
    const { url } = await this.uploader.upload({ fileName, fileType, body });

    // Cria um novo anexo com o título e a URL
    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    // Salva o anexo no repositório de anexos
    await this.attachmentsRepository.create(attachment);

    // Retorna o anexo criado dentro de um objeto Either, utilizando a função right para indicar sucesso
    return right({
      attachment,
    });
  }
}
