import {Body, ConflictException, Controller, HttpCode, Post} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {hash} from "bcryptjs";
import {z} from "zod";




const createAccountBodySchema = z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(8)
})

type CreateAccountBodySchema =  z.infer<typeof createAccountBodySchema>


@Controller('/accounts')
export class CreateAccountController{

    constructor(private prisma:PrismaService) {}

    @Post()
    @HttpCode(201)
    async handle(@Body() body:CreateAccountBodySchema){

        const { name, email, password } = createAccountBodySchema.parse(body)

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(userWithSameEmail){
          throw new ConflictException('User with same email already exists')
        }

        const passwordHash = await hash(password,'')


        await this.prisma.user.create({
            data: {
                name,
                email,
                password:passwordHash
            }
        })

    }
}