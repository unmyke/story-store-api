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
  UPLOAD_STORE: {
    type: Symbol('upload-store'),
  },
  HTTP: {
    name: Symbol('http'),
    codes: {
      BAD_REQUEST: Symbol('bad-request'),
    },
  },
  HANDLER: {
    name: Symbol('handler'),
  },
  EVENT_BUS: {
    name: Symbol('event-bus'),
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
class UploadStore extends BaseError {
  type = ErrorTypes.HANDLER.name;
}
class BadRequest extends BaseError {
  type = ErrorTypes.HTTP.name;
  code = ErrorTypes.HTTP.codes.BAD_REQUEST;
}
class Handler extends BaseError {
  type = ErrorTypes.HANDLER.name;
}
class EventBus extends BaseError {
  type = ErrorTypes.HANDLER.name;
}
export const Errors = {
  Validation,
  Config,
  Domain,
  NotFound,
  Connection,
  Query,
  UploadStore,
  BadRequest,
  Handler,
  EventBus,
};
