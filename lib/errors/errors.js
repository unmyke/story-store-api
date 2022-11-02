export const types = {
  DOMAIN: {
    name: 'domain',
  },
  DATA_ACCESS: {
    name: 'data-access',
    codes: {
      NOT_FOUND: 'not-found',
    },
  },
  HTTP: {
    name: 'http',
    codes: {
      BAD_REQUEST: 'bad-request',
    },
  },
};
class BaseError extends Error {
  constructor(message, causeError) {
    super(message);
    if (causeError) this.cause = causeError;
  }
}
class Domain extends BaseError {
  type = types.DOMAIN.name;
}
class NotFound extends BaseError {
  type = types.DATA_ACCESS.name;
  code = types.DATA_ACCESS.codes.NOT_FOUND;
}
class BadRequest extends BaseError {
  type = types.HTTP.name;
  code = types.HTTP.codes.BAD_REQUEST;
}
export const errors = {
  Domain,
  NotFound,
  BadRequest,
};
