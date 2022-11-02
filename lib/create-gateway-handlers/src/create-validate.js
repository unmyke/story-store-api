import { createValidate as createBaseValidate } from '@lib/create-validate';

export const createValidate = ({ name, schemas }) => {
  const validateRequest = createBaseValidate(schemas.request);
  const validateResponse = createLogValidation({
    validate: createBaseValidate(schemas.response),
    message: `Response to "${name}" is invalid, fix your response or response schema`,
  });
  return { validateRequest, validateResponse };
};

const createLogValidation =
  ({ validate, message }) =>
  (data) => {
    try {
      validate(data);
    } catch ({ errors }) {
      console.warn(message);
      console.debug(JSON.stringify({ data, errors }));
    }
  };
