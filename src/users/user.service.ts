import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { Page, PaginatedData } from '../shared/pagination.types';

@Injectable()
export class UserService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdCat = this.userModel.create(createUserDto);
    return createdCat;
  }

  async findAll(page: Page): Promise<PaginatedData<User>> {
    const skip = (page.num - 1) * page.size;

    // Create promises to get data and total count
    const dataPromise = this.userModel.find().skip(skip).limit(page.size).exec();
    const countPromise = this.userModel.countDocuments().exec();

    // Wait for both promises to resolve
    const [data, totalCount] = await Promise.all([dataPromise, countPromise]);

    // Calculate the next page
    const nextPage = page.num * page.size < totalCount ? { num: page.num + 1, size: page.size } : undefined;

    // Return the paginated data
    return { data, nextPage };
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true, runValidators: true },
    );
  }

  async delete(id: string): Promise<User | null> {
    return await this.userModel.findByIdAndDelete(id);
  }
}
