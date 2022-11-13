import { response } from './response';

describe('# @lib/aws-events::sqs::response', () => {
  describe('## response.toSuccessAwsResponse', () => {
    it('should return success HTTP response', () => {
      const handlerResponse = 'response';
      expect(response.toSuccessAwsResponse(handlerResponse)).toStrictEqual({
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: '"response"',
      });
    });
  });

  describe('## response.toErrorAwsResponse', () => {
    const handlerError = new Error('error message');
    it('should return internal sever error HTTP response', () => {
      response.toErrorAwsResponse(handlerError);
      expect(response.toErrorAwsResponse(handlerError)).toStrictEqual({
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: '"Internal Server Error"',
      });
    });
  });
});
