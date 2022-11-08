import { format } from 'util';

export const ErrorTypes = {
  VALIDATION: {
    name: Symbol('validation'),
  },
  CONFIG: {
    name: Symbol('config'),
  },
  DOMAIN: {
    name: Symbol('domain'),
  },
  DATA_ACCESS: {
    name: Symbol('data-access'),
    codes: {
      NOT_FOUND: Symbol('not-found'),
      CONNECTION: Symbol('connection'),
      QUERY: Symbol('query'),
    },
  },
  HTTP: {
    name: Symbol('http'),
    codes: {
      BAD_REQUEST: Symbol('bad-request'),
    },
  },
};
class BaseError extends Error {
  constructor(message, causeError) {
    super(message);
    if (causeError) this.cause = causeError;
  }
}
class Validation extends BaseError {
  constructor(schemaName, errors, causeError) {
    super(
      format('An error accure while validating %s', schemaName),
      causeError,
    );
    this.errors = errors;
  }
  type = ErrorTypes.VALIDATION.name;
}
class Config extends BaseError {
  type = ErrorTypes.CONFIG.name;
}
class Domain extends BaseError {
  type = ErrorTypes.DOMAIN.name;
}
class NotFound extends BaseError {
  type = ErrorTypes.DATA_ACCESS.name;
  code = ErrorTypes.DATA_ACCESS.codes.NOT_FOUND;
}
class Connection extends BaseError {
  type = ErrorTypes.DATA_ACCESS.name;
  code = ErrorTypes.DATA_ACCESS.codes.CONNECTION;
}
class Query extends BaseError {
  type = ErrorTypes.DATA_ACCESS.name;
  code = ErrorTypes.DATA_ACCESS.codes.QUERY;
}
class BadRequest extends BaseError {
  type = ErrorTypes.HTTP.name;
  code = ErrorTypes.HTTP.codes.BAD_REQUEST;
}
export const Errors = {
  Validation,
  Config,
  Domain,
  NotFound,
  Connection,
  Query,
  BadRequest,
};
