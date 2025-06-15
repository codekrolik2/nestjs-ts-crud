import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
import { zodSchemaValidate } from "./zod-pipe-common";

export class ZodParameterValidationPipe implements PipeTransform {
  constructor(private parameterName: string, private schema: ZodSchema) {}

  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data !== this.parameterName) {
      return value;
    }
    return zodSchemaValidate(value, this.schema);
  }
}
