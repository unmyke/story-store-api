import { errors } from '@lib/errors';

import * as requestParsers from './parsers';

const parserEntries = Object.entries(requestParsers);

export const getParser = (request) => {
  const parserEntry = parserEntries.find(([, { predicate }]) =>
    predicate(request),
  );
  if (!parserEntry) throw new errors.BadRequest('request parser not found');
  const [name, { parse }] = parserEntry;
  return { name, parse: () => parse(request) };
};
