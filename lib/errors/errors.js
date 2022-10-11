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

class Domain extends Error {
  type = types.DOMAIN.name;
}
class NotFound extends Error {
  type = types.DATA_ACCESS.name;
  code = types.DATA_ACCESS.codes.NOT_FOUND;
}
class BadRequest extends Error {
  type = types.HTTP.name;
  code = types.HTTP.codes.BAD_REQUEST;
}
export const errors = {
  Domain,
  NotFound,
  BadRequest,
};
