import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { commonJSONSchemas } from '@lib/common-json-schemas';
import { Errors } from '@lib/errors';

export const createValidate = (schemaOrSchemaWithReferences = {}) => {
  if (isEmptySchema(schemaOrSchemaWithReferences)) return identity;
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const { schema, references } = getSchemaAndReferences(
    schemaOrSchemaWithReferences,
  );
  const validate = [...commonJSONSchemas, ...references]
    .reduce((prevAjv, reference) => prevAjv.addSchema(reference), ajv)
    .compile(schema);
  return (data) => {
    if (validate(data)) return data;
    throw new Errors.Validation(schema.title, validate.errors);
  };
};

const identity = (item) => item;

const isEmptySchema = (schema) =>
  Object.getOwnPropertyNames(schema).length === 0;

const getSchemaAndReferences = (schemaOrSchemaWithReferences) => {
  if (isSchemaWithReferences(schemaOrSchemaWithReferences))
    return schemaOrSchemaWithReferences;
  return { schema: schemaOrSchemaWithReferences, references: [] };
};

const isSchemaWithReferences = (schemaOrSchemaWithReferences) =>
  'schema' in schemaOrSchemaWithReferences &&
  'references' in schemaOrSchemaWithReferences;
