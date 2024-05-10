import {Controller, HttpCode, Post, Req, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Request} from "express";
import {CurrentUser} from "../auth/current-user-decorator";
import {TokenPayload} from "../auth/jwt.strategy";



@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController{
    constructor() {}

    @HttpCode(201)
    @Post()
    async handle(@CurrentUser() user:TokenPayload){

      console.log(user)


    }
}