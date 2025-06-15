import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
import { zodSchemaValidate } from "./zod-pipe-common";

export class ZodBodyValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: Record<string, unknown>, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    return zodSchemaValidate(value, this.schema);
  }
}
