import {Attachment, AttachmentProps} from "@/domain/forum/enterprise/entities/attachment";
import {UniqueEntityId} from "@/core/entities/unique-entity-id";
import {faker} from "@faker-js/faker";
import {Injectable} from "@nestjs/common";
import {PrismaService} from "@/infra/database/prisma/prisma.service";
import {PrismaAttachmentMapper} from "@/infra/database/prisma/mappers/prisma-attachment-mapper";

export function makeAttachment(
    override :Partial<AttachmentProps> = {},
    id?: UniqueEntityId,
){
    const attachments = Attachment.create(
        {
            title:faker.lorem.slug(),
            url:faker.lorem.slug(),
            ...override
        },
        id,
    )

    return attachments
}
@Injectable()
export class AttachmentFactory{
    constructor(private prisma:PrismaService) {
    }

    async makePrismaAttachment(
        data:Partial<AttachmentProps> = {},

    ): Promise<Attachment>{
        const attachemnt = makeAttachment(data)


        await this.prisma.attachment.create({
            data:PrismaAttachmentMapper.toPrisma(attachemnt)
        })

        return attachemnt
    }
}