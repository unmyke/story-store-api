import { createValidate } from '@lib/create-validate';

export const createValidateHandlerResponse = ({ name, schema }) => {
  const validate = createValidate(schema);
  return (handlerResponse) => {
    try {
      validate(handlerResponse);
    } catch (error) {
      logHandlerResponseValidationError({
        name,
        schema,
        response: handlerResponse,
      });
    }
  };
};
const logHandlerResponseValidationError = ({ name, schema, response }) => {
  console.warn(
    `Response to "${name}" is invalid, fix your response or response schema`,
  );
  console.debug({ schema, response });
};
