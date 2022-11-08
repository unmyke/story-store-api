import { Methods } from './methods';
import { toHttpRequest } from './to-http-request';

describe('# @lib/aws-events::toHttpRequest', () => {
  describe(`when passed ${Methods.GET} method`, () => {
    it('should return request with "params" and "query" fields', () => {
      const event = {
        method: Methods.GET,
        params: 'params',
        query: 'query',
        body: 'body',
      };
      expect(toHttpRequest(event)).toStrictEqual({
        params: 'params',
        query: 'query',
      });
    });
  });

  describe(`when passed ${Methods.POST} method`, () => {
    it('should return request with "params" and "body" fields', () => {
      const event = {
        method: Methods.POST,
        params: 'params',
        query: 'query',
        body: 'body',
      };
      expect(toHttpRequest(event)).toStrictEqual({
        params: 'params',
        body: 'body',
      });
    });
  });

  describe(`when passed ${Methods.PUT} method`, () => {
    it('should return request with "params" and "body" fields', () => {
      const event = {
        method: Methods.PUT,
        params: 'params',
        query: 'query',
        body: 'body',
      };
      expect(toHttpRequest(event)).toStrictEqual({
        params: 'params',
        body: 'body',
      });
    });
  });

  describe(`when passed ${Methods.PATCH} method`, () => {
    it('should return request with "params" and "body" fields', () => {
      const event = {
        method: Methods.PATCH,
        params: 'params',
        query: 'query',
        body: 'body',
      };
      expect(toHttpRequest(event)).toStrictEqual({
        params: 'params',
        body: 'body',
      });
    });
  });

  describe(`when passed ${Methods.DELETE} method`, () => {
    it('should return request with "params" field', () => {
      const event = {
        method: Methods.DELETE,
        params: 'params',
        query: 'query',
        body: 'body',
      };
      expect(toHttpRequest(event)).toStrictEqual({
        params: 'params',
      });
    });
  });

  describe(`when passed unexpected method`, () => {
    it('should throw BadRequest error', () => {
      const event = {
        method: 'UNEXPECTED_METHOD',
        params: 'params',
        query: 'query',
        body: 'body',
      };
      expect(() => toHttpRequest(event)).toThrow({
        message: 'method "UNEXPECTED_METHOD" not implemented',
      });
    });
  });
});
