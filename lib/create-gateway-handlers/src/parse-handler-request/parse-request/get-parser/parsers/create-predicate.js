import { createValidate } from '@lib/create-validate';

export const createPredicate = (eventSchema) => {
  const validate = createValidate(eventSchema);
  return (event) => {
    try {
      validate(event);
      return true;
    } catch (error) {
      return false;
    }
  };
};
