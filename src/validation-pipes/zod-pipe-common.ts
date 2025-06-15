import { BadRequestException } from "@nestjs/common";
import { ZodSchema } from "zod";

export function zodSchemaValidate(value, schema: ZodSchema) {
    const result = schema.safeParse(value);
    if (result.success) {
        return result.data;
    }

    const issue = result.error.issues[0];
    throw new BadRequestException(
        issue
        ? `${issue.message}: '${issue.path.join(".")}'`
        : "Validation failed",
    );
}
