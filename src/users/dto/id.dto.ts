import { z } from 'zod';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export const idSchema = z.string().refine((id) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid User ID format "${id}"`);
    }
    return true;
  });
