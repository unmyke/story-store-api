import { errors } from '@lib/errors';

export const createConnectionHooks = (client) => {
  const connect = createHook({
    client,
    methodName: 'connect',
    errorMessage: 'An error occured while try to connect to database',
  });
  const disconnect = createHook({
    client,
    methodName: 'end',
    errorMessage: 'An error occured while try to close database connection',
  });
  return { connect, disconnect };
};
const createHook = ({ client, methodName, errorMessage }) => {
  return async () => {
    const method = client[methodName].bind(client);
    try {
      await method();
    } catch (error) {
      throw new errors.Connection(errorMessage, error);
    }
  };
};
