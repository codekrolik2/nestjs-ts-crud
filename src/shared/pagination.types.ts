import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface Response<T> {
  data: T;
}

export interface Page {
  num: number;
  size: number;
}

export interface PaginatedData<T> {
  data: T[];
  nextPage?: Page;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: { next?: string };
}

const FIRST_PAGE = 1;
const PAGE_SIZE = 10;
const PAGE_QUERY_PARAM = "page";
const PAGE_SIZE_QUERY_PARAM = "size";

export function urlWithoutQueryParameters(request: Request): string {
  const protocolAndHost = `${request.protocol}://${request.get("Host")}`;
  const pathname = new URL(`${protocolAndHost}${request.originalUrl}`).pathname;
  return `${protocolAndHost}${pathname}`;
}

export function nextLink(parameters: {
  nextPage?: Page;
  request: Request;
}): string | undefined {
  const { nextPage, request } = parameters;
  return nextPage
    ? `${urlWithoutQueryParameters(request)}?${PAGE_QUERY_PARAM}=${nextPage.num}`
    : undefined;
}

export function dataToResponse<T>(request: Request, 
                                  paginatedData: PaginatedData<T>): PaginatedResponse<T> {
  const { data, nextPage } = paginatedData;
  return {
    data: data,
    links: { next: nextLink({ nextPage, request }) },
  };
}

export function getPage(pageNum?: number, pageSize?: number): Page {
  return { num: pageNum ? pageNum : FIRST_PAGE, size: pageSize ? pageSize : PAGE_SIZE };
}

function parseOptionalInt(value?: string): number | undefined {
  return value ? parseInt(value, 10) : undefined;
}

// NestJS Decorator
export const PaginationPage = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseOptionalInt(request.query[PAGE_QUERY_PARAM]);
    const size = parseOptionalInt(request.query[PAGE_SIZE_QUERY_PARAM]);

    return getPage(page, size);
  },
);
