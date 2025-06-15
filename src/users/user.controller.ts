import { Controller, Get, Post, Patch, Delete, Param, Body, HttpException, HttpStatus,  UsePipes, Req, Ip, } from '@nestjs/common';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { ZodBodyValidationPipe } from '../validation-pipes/zod-body-validation-pipe';
import { dataToResponse, Page, PaginatedResponse, PaginationPage, urlWithoutQueryParameters } from '../shared/pagination.types';
import { Request } from "express";
import { ZodParameterValidationPipe } from '../validation-pipes/zod-parameter-validation-pipe';
import { idSchema } from './dto/id.dto';
import { LoggerService } from '../logger/logger.service';

@Controller('users')
export class UserController {
  private readonly logger = new LoggerService(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ZodBodyValidationPipe(createUserSchema))
  async create(
    @Ip() ip: string, 
    @Body() createUserDto: CreateUserDto) {
    this.logger.log(`create; ip ${ip}; createUserDto ${JSON.stringify(createUserDto)}`);

    return this.userService.create(createUserDto);
  }

  @Get(":id")
  @UsePipes(new ZodParameterValidationPipe("id", idSchema))
  async findById(
    @Ip() ip: string, 
    @Param("id") id: string
  ): Promise<User> {
    this.logger.log(`findById; ip ${ip}; id ${id}`);

    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException(`User id "${id}" not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get()
  async findAll(
    @Ip() ip: string, 
    @Req() request: Request,
    @PaginationPage() page: Page,
  ): Promise<PaginatedResponse<User>> {
    this.logger.log(`findAll; ip ${ip}; page ${JSON.stringify(page)}; URL ${JSON.stringify(urlWithoutQueryParameters(request))}`);

    const users = await this.userService.findAll(page);
    return dataToResponse(request, users);
  }

  @Patch(':id')
  @UsePipes(new ZodParameterValidationPipe("id", idSchema))
  @UsePipes(new ZodBodyValidationPipe(updateUserSchema))
  async update(
    @Ip() ip: string, 
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    this.logger.log(`update; ip ${ip}; id ${JSON.stringify(id)}; updateUserDto ${JSON.stringify(updateUserDto)}`);

    const updatedUser = await this.userService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new HttpException(`User id "${id}" not found`, HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  @UsePipes(new ZodParameterValidationPipe("id", idSchema))
  async delete(
    @Ip() ip: string, 
    @Param('id') id: string,
  ): Promise<User> {
    this.logger.log(`delete; ip ${ip}; id ${JSON.stringify(id)}}`);

    const updatedUser = await this.userService.delete(id);
    if (!updatedUser) {
      throw new HttpException(`User id "${id}" not found`, HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }
}
