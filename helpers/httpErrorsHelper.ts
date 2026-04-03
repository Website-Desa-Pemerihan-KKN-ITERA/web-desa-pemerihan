export type ErrorStatus =
  | "USER_NOT_FOUND"
  | "INVALID_PASSWORD"
  | "DATABASE_ERROR"
  | "VALIDATION_ERROR"
  | "SLUG_ALREADY_EXISTS"
  | "PAGE_NOT_FOUND"
  | "ARTICLE_NOT_FOUND"
  | "SHOP_ITEM_NOT_FOUND"
  | "ACCOUNT_NOT_FOUND"
  | "USERNAME_ALREADY_EXISTS"
  | "UNKNOWN_ERROR";

type HttpErrorConfig = {
  statusCode: number;
};

export const ERROR_STATUS_CODE_MAPPER: Record<ErrorStatus, HttpErrorConfig> = {
  USER_NOT_FOUND: {
    statusCode: 401,
  },
  INVALID_PASSWORD: {
    statusCode: 401,
  },
  DATABASE_ERROR: {
    statusCode: 500,
  },
  VALIDATION_ERROR: {
    statusCode: 400,
  },
  SLUG_ALREADY_EXISTS: {
    statusCode: 409,
  },
  PAGE_NOT_FOUND: {
    statusCode: 404,
  },
  ARTICLE_NOT_FOUND: {
    statusCode: 404,
  },
  SHOP_ITEM_NOT_FOUND: {
    statusCode: 404,
  },
  ACCOUNT_NOT_FOUND: {
    statusCode: 404,
  },
  USERNAME_ALREADY_EXISTS: {
    statusCode: 409,
  },
  UNKNOWN_ERROR: {
    statusCode: 500,
  },
};
