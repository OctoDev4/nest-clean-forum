// Importa a interface Uploader e o tipo UploadParams
import { Uploader, UploadParams } from '@/domain/forum/application/storage/uploader';
// Importa o S3Client e o PutObjectCommand da AWS SDK
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// Importa o serviço de ambiente
import { EnvService } from '@/infra/env/env.service';
// Importa a função randomUUID do módulo crypto do Node.js
import { randomUUID } from 'node:crypto';
// Importa o decorador Injectable do NestJS
import { Injectable } from '@nestjs/common';

@Injectable()
// Definição da classe R2Storage que implementa a interface Uploader
export class R2Storage implements Uploader {

  // Cliente S3 da AWS
  private client: S3Client;

  // Construtor que recebe o serviço de ambiente
  constructor(
    private envService: EnvService,
  ) {
    // Obtém o ID da conta Cloudflare do serviço de ambiente
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID');

    // Inicializa o cliente S3 com as configurações específicas da Cloudflare R2
    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  // Método assíncrono upload para realizar o upload de arquivos
  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    // Gera um UUID aleatório para garantir a unicidade do nome do arquivo
    const upload = randomUUID();

    // Cria um nome de arquivo único concatenando o UUID com o nome do arquivo original
    const uniqueFileName = `${upload}-${fileName}`;

    // Envia o comando PutObject para o cliente S3 para realizar o upload do arquivo
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    // Retorna a URL única do arquivo
    return {
      url: uniqueFileName,
    };
  }
}
