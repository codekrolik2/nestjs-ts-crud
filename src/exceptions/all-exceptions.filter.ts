import { ArgumentsHost, HttpStatus, HttpException, Catch } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { LoggerService } from "../logger/logger.service";

type MyResponseObj = {
    statusCode: number,
    timestamp: string,
    path: string, 
    response: string | object,
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new LoggerService(AllExceptionsFilter.name);
    catch (exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const myResponseObj: MyResponseObj = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: 'Unknown Error',
        }

        if (exception instanceof HttpException) {
            myResponseObj.statusCode = exception.getStatus();
            myResponseObj.response = exception.getResponse();
        } else if (exception instanceof mongoose.mongo.MongoError) {
            myResponseObj.statusCode = 422;
            myResponseObj.response = exception.message.replaceAll(/\n/g, '');
        } else {
            myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            myResponseObj.response = 'Internal Server Error';
        }

        response.status(myResponseObj.statusCode)
                .json(myResponseObj)

        this.logger.error("Uncaught Exception: " + myResponseObj.response);

        super.catch(exception, host);
    }
}