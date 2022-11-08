import { ErrorTypes } from '@lib/errors';

import { createValidate } from './create-validate';

const catchError = (callback) => {
  try {
    callback();
    throw new Error('Test failed');
  } catch (error) {
    return error;
  }
};

describe('# @lib/create-validation', () => {
  describe('when passed invalid schema', () => {
    it('should throw', () => {
      expect(() => createValidate({ invalidSchema: 'invalidSchema' })).toThrow(
        'strict mode: unknown keyword: "invalidSchema"',
      );
    });
  });

  describe('when passed valid schema', () => {
    describe('when passed only schema', () => {
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema',
        title: 'Model',
        type: 'object',
        properties: {
          prop1: {
            title: 'Property 1',
            type: 'string',
          },
          prop2: {
            title: 'Property 2',
            type: 'integer',
          },
          prop3: {
            title: 'Property 3',
            type: 'boolean',
          },
        },
        required: ['prop1', 'prop2', 'prop3'],
        additionalProperties: false,
      };
      const validate = createValidate(schema);

      describe('when passed data respects schema', () => {
        it('should return object', () => {
          const data = { prop1: 'prop1', prop2: 2, prop3: false };
          expect(validate(data)).toBe(data);
        });
      });

      describe('when passed data not respects schema', () => {
        it('should throw error', () => {
          const error = catchError(() => validate({}));
          expect(error).toMatchObject({
            type: ErrorTypes.VALIDATION.name,
            message: 'An error accure while validating Model',
            errors: [
              {
                keyword: 'required',
                schemaPath: '#/required',
                params: {
                  missingProperty: 'prop1',
                },
                message: "must have required property 'prop1'",
              },
              {
                keyword: 'required',
                schemaPath: '#/required',
                params: {
                  missingProperty: 'prop2',
                },
                message: "must have required property 'prop2'",
              },
              {
                keyword: 'required',
                schemaPath: '#/required',
                params: {
                  missingProperty: 'prop3',
                },
                message: "must have required property 'prop3'",
              },
            ],
          });
        });
      });
    });

    describe('when passed schema with references', () => {
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema',
        title: 'Model',
        type: 'object',
        properties: {
          prop1: {
            $ref: 'http://example.com/schemas/refs/ref1.json',
          },
          prop2: {
            $ref: 'http://example.com/schemas/refs/ref2.json',
          },
        },
        required: ['prop1', 'prop2'],
        additionalProperties: false,
      };
      const ref1 = {
        $schema: 'http://json-schema.org/draft-07/schema',
        $id: 'http://example.com/schemas/refs/ref1.json',
        title: 'Reference Model 1',
        type: 'string',
      };
      const ref2 = {
        $schema: 'http://json-schema.org/draft-07/schema',
        $id: 'http://example.com/schemas/refs/ref2.json',
        title: 'Reference Model 2',
        type: 'string',
      };
      const references = [ref1, ref2];
      const validate = createValidate({ schema, references });

      describe('when passed data respects schema', () => {
        it('should return object', () => {
          const data = { prop1: 'ref1', prop2: 'ref2' };
          expect(validate(data)).toBe(data);
        });
      });

      describe('when passed data not respects schema', () => {
        it('should throw error', () => {
          const error = catchError(() => validate({}));
          expect(error).toMatchObject({
            type: ErrorTypes.VALIDATION.name,
            message: 'An error accure while validating Model',
            errors: [
              {
                keyword: 'required',
                schemaPath: '#/required',
                params: {
                  missingProperty: 'prop1',
                },
                message: "must have required property 'prop1'",
              },
              {
                keyword: 'required',
                schemaPath: '#/required',
                params: {
                  missingProperty: 'prop2',
                },
                message: "must have required property 'prop2'",
              },
            ],
          });
        });
      });
    });
  });
});
