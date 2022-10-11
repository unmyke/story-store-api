import { pingPong } from './ping-pong';

describe('# services:pingPong', () => {
  it('should return response with status 201 and JSON body as passed request', async () => {
    const request = { test: 'test' };
    const response = await pingPong(request);
    expect(response).toStrictEqual({
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  });
});
