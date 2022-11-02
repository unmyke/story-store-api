import { errors } from '@lib/errors';

import { createGatewayHandlers } from './create-gateway-handlers';

describe('# lib:createGatewayHandlers', () => {
  describe('when no handlers passed', () => {
    it('should return empty object', () => {
      expect.assertions(1);
      const gatewayHandlers = createGatewayHandlers({
        handlers: {},
        context: {},
      });
      expect(gatewayHandlers).toStrictEqual({});
    });
  });

  describe('when handlers passed', () => {
    it('should pass context to handler factories', () => {
      expect.assertions(4);
      const context = {};
      const request = {};
      const response = {};
      const schemas = { request, response };
      const handler1Factory = jest.fn();
      const handler2Factory = jest.fn();
      const handler1 = { schemas, factory: handler1Factory };
      const handler2 = { schemas, factory: handler2Factory };
      const handlers = { handler1, handler2 };
      createGatewayHandlers({ handlers, context });
      expect(handler1Factory).toHaveBeenCalledTimes(1);
      expect(handler1Factory).toHaveBeenCalledWith(context);
      expect(handler2Factory).toHaveBeenCalledTimes(1);
      expect(handler2Factory).toHaveBeenCalledWith(context);
    });

    it('should return gateway handlers', () => {
      expect.assertions(2);
      const context = {};
      const gatewayHandler1 = () => {};
      const request = {};
      const response = {};
      const schemas = { request, response };
      const handler1Factory = () => gatewayHandler1;
      const handler1 = { schemas, factory: handler1Factory };
      const gatewayHandler2 = () => {};
      const handler2Factory = () => gatewayHandler2;
      const handler2 = {
        schemas: { request, response },
        factory: handler2Factory,
      };
      const handlers = { handler1, handler2 };
      const gatewayHandlers = createGatewayHandlers({ handlers, context });
      expect(gatewayHandlers).toHaveProperty('handler1');
      expect(gatewayHandlers).toHaveProperty('handler2');
    });

    describe('## gateway handler', () => {
      describe('when passed handler have empty request and response schemas', () => {
        const request = {};
        const response = {};
        const schemas = { request, response };
        const factory = () => (request) => ({ statusCode: 200, body: request });
        const handler = { schemas, factory };
        const context = {};
        const handlers = { handler };
        const { handler: gatewayHandler } = createGatewayHandlers({
          handlers,
          context,
        });

        describe('when passed http api request', () => {
          describe('when passed request is correct', () => {
            describe('when passed GET request', () => {
              it('should return status 200', async () => {
                const httpApiRequest = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',
                  requestContext: { http: { method: 'GET' } },
                };
                const { statusCode, body } = await gatewayHandler(
                  httpApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, query: {} }),
                );
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with request's params", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',

                      requestContext: { http: { method: 'GET' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: httpApiRequest.pathParameters,
                        query: {},
                      }),
                    );
                  });
                });

                describe('- query', () => {
                  describe('when passed single-value params', () => {
                    it("should return JSON body with filter as request's query", async () => {
                      const httpApiRequest = {
                        version: '2.0',
                        routeKey: '/path',
                        rawPath: '/path',

                        requestContext: { http: { method: 'GET' } },
                        queryStringParameters: { test: 'test' },
                      };
                      const { body } = await gatewayHandler(httpApiRequest);
                      expect(body).toBe(
                        JSON.stringify({
                          params: {},
                          query: httpApiRequest.queryStringParameters,
                        }),
                      );
                    });
                  });

                  describe('when passed multi-value params', () => {
                    it("should return JSON body with filter as request's query", async () => {
                      const httpApiRequest = {
                        version: '2.0',
                        routeKey: '/path',
                        rawPath: '/path',

                        requestContext: { http: { method: 'GET' } },
                        queryStringParameters: { test: 'test1,test2' },
                      };
                      const { body } = await gatewayHandler(httpApiRequest);
                      expect(body).toBe(
                        JSON.stringify({
                          params: {},
                          query: { test: ['test1', 'test2'] },
                        }),
                      );
                    });
                  });
                });
              });
            });

            describe('when passed POST request', () => {
              it('should return status 200', async () => {
                const httpApiRequest = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',

                  requestContext: { http: { method: 'POST' } },
                };
                const { statusCode, body } = await gatewayHandler(
                  httpApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  request's params", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',

                      requestContext: { http: { method: 'POST' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: httpApiRequest.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as request's body", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'POST' } },
                      body: JSON.stringify({ test: 'test' }),
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(httpApiRequest.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed PUT request', () => {
              it('should return status 200', async () => {
                const httpApiRequest = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',
                  requestContext: { http: { method: 'PUT' } },
                };
                const { statusCode, body } = await gatewayHandler(
                  httpApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  request's params", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'PUT' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: httpApiRequest.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as request's body", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'PUT' } },
                      body: JSON.stringify({ test: 'test' }),
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(httpApiRequest.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed PATCH request', () => {
              it('should return status 200', async () => {
                const httpApiRequest = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',
                  requestContext: { http: { method: 'PATCH' } },
                };
                const { statusCode, body } = await gatewayHandler(
                  httpApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  request's params", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'PATCH' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: httpApiRequest.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as request's body", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'PATCH' } },
                      body: JSON.stringify({ test: 'test' }),
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(httpApiRequest.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed DELETE request', () => {
              it('should return status 200', async () => {
                const httpApiRequest = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',
                  requestContext: { http: { method: 'DELETE' } },
                };
                const { statusCode, body } = await gatewayHandler(
                  httpApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(JSON.stringify({ params: {} }));
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  request's params", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'DELETE' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({ params: httpApiRequest.pathParameters }),
                    );
                  });
                });
              });
            });

            describe('when handler throw with:', () => {
              const httpApiRequest = {
                version: '2.0',
                routeKey: '/path',
                rawPath: '/path',
                requestContext: { http: { method: 'GET' } },
              };
              const factory = (error) => () => {
                throw error;
              };
              const handler = { schemas: { request, response }, factory };
              const handlers = { handler };

              describe('- unexpected error', () => {
                it('should return status 500 and JSON error', async () => {
                  const context = new Error('unexpected error');
                  const { handler: gatewayHandler } = createGatewayHandlers({
                    handlers,
                    context,
                  });
                  const { statusCode, body } = await gatewayHandler(
                    httpApiRequest,
                  );
                  expect(statusCode).toBe(500);
                  expect(body).toBe(
                    JSON.stringify({ message: 'Internal Server Error' }),
                  );
                });
              });

              describe('- domain error', () => {
                it('should return status 500 and JSON error', async () => {
                  const context = new errors.Domain('domain error');
                  const { handler: gatewayHandler } = createGatewayHandlers({
                    handlers,
                    context,
                  });
                  const { statusCode, body } = await gatewayHandler(
                    httpApiRequest,
                  );
                  expect(statusCode).toBe(400);
                  expect(body).toBe(
                    JSON.stringify({
                      message: `Bad Request: ${context.message}`,
                    }),
                  );
                });
              });

              describe('- NotFound error', () => {
                const context = new errors.NotFound('test error');
                const { handler: gatewayHandler } = createGatewayHandlers({
                  handlers,
                  context,
                });

                it('should return status 403', async () => {
                  const { statusCode, body } = await gatewayHandler(
                    httpApiRequest,
                  );
                  expect(statusCode).toBe(404);
                  expect(body).toBe(
                    JSON.stringify({ message: context.message }),
                  );
                });
              });
            });
          });

          describe('when passed request has incorrect:', () => {
            describe('- method', () => {
              const httpApiRequest = {
                version: '2.0',
                routeKey: '/path',
                rawPath: '/path',
                requestContext: { http: { method: 'UNEXPECTED_METHOD' } },
              };

              it('should return status 400', async () => {
                const { statusCode } = await gatewayHandler(httpApiRequest);
                expect(statusCode).toBe(400);
              });

              it('should return JSON error', async () => {
                const { body } = await gatewayHandler(httpApiRequest);
                expect(body).toBe(
                  JSON.stringify({
                    message:
                      'Bad Request: method "UNEXPECTED_METHOD" not implemented',
                  }),
                );
              });
            });

            describe('- body', () => {
              const httpApiRequest = {
                version: '2.0',
                routeKey: '/path',
                rawPath: '/path',
                requestContext: { http: { method: 'POST' } },
                body: ']incorrect body[',
              };

              it('should return status 400', async () => {
                const { statusCode } = await gatewayHandler(httpApiRequest);
                expect(statusCode).toBe(400);
              });

              it('should return JSON error', async () => {
                const { body } = await gatewayHandler(httpApiRequest);
                expect(body).toBe(
                  JSON.stringify({
                    message: 'Bad Request: "httpApi" request is incorrect',
                  }),
                );
              });
            });
          });
        });

        describe('when passed rest api request', () => {
          describe('when passed request is correct', () => {
            describe('when passed GET request', () => {
              it('should return status 200', async () => {
                const restApiRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await gatewayHandler(
                  restApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, query: {} }),
                );
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with request's params", async () => {
                    const restApiRequest = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'GET',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param: 'value' },
                      body: null,
                    };
                    const { body } = await gatewayHandler(restApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: restApiRequest.pathParameters,
                        query: {},
                      }),
                    );
                  });
                });

                describe('- query', () => {
                  it("should return JSON body with filter as request's query", async () => {
                    const restApiRequest = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'GET',
                      queryStringParameters: {
                        field1: 'value1',
                        field2: 'value2',
                      },
                      multiValueQueryStringParameters: {
                        field1: ['value1'],
                        field2: ['value1', 'value2'],
                      },
                      pathParameters: null,
                      body: null,
                    };
                    const { body } = await gatewayHandler(restApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        query: {
                          field1: 'value1',
                          field2: ['value1', 'value2'],
                        },
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed POST request', () => {
              it('should return status 200', async () => {
                const restApiRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'POST',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await gatewayHandler(
                  restApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  request's params", async () => {
                    const restApiRequest = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'POST',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param1: 'value1', param2: 'value2' },
                      body: null,
                    };
                    const { body } = await gatewayHandler(restApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: restApiRequest.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as request's body", async () => {
                    const restApiRequest = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'POST',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: null,
                      body: JSON.stringify({
                        field1: 'value1',
                        field2: ['value1', 'value2'],
                        field3: 3,
                        field4: true,
                      }),
                    };
                    const { body } = await gatewayHandler(restApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(restApiRequest.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed PUT request', () => {
              it('should return status 200', async () => {
                const restApiRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'PUT',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await gatewayHandler(
                  restApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  request's params", async () => {
                    const restApiRequest = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'PUT',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param1: 'value1', param2: 'value2' },
                      body: null,
                    };
                    const { body } = await gatewayHandler(restApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: restApiRequest.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as request's body", async () => {
                    const restApiRequest = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'PUT',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: null,
                      body: JSON.stringify({
                        field1: 'value1',
                        field2: ['value1', 'value2'],
                        field3: 3,
                        field4: true,
                      }),
                    };
                    const { body } = await gatewayHandler(restApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(restApiRequest.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed PATCH request', () => {
              it('should return status 200', async () => {
                const restApiRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'PATCH',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await gatewayHandler(
                  restApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  request's params", async () => {
                    const restApiRequest = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'PATCH',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param1: 'value1', param2: 'value2' },
                      body: null,
                    };
                    const { body } = await gatewayHandler(restApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: restApiRequest.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as request's body", async () => {
                    const restApiRequest = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'PATCH',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: null,
                      body: JSON.stringify({
                        field1: 'value1',
                        field2: ['value1', 'value2'],
                        field3: 3,
                        field4: true,
                      }),
                    };
                    const { body } = await gatewayHandler(restApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(restApiRequest.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed DELETE request', () => {
              it('should return status 200', async () => {
                const restApiRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'DELETE',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await gatewayHandler(
                  restApiRequest,
                );
                expect(statusCode).toBe(200);
                expect(body).toBe('{"params":{}}');
              });

              describe('when handler retruns request and request contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  request's params", async () => {
                    const restApiRequest = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'DELETE',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param1: 'value1', param2: 'value2' },
                      body: null,
                    };
                    const { body } = await gatewayHandler(restApiRequest);
                    expect(body).toBe(
                      JSON.stringify({ params: restApiRequest.pathParameters }),
                    );
                  });
                });
              });
            });

            describe('when handler throw with:', () => {
              const restApiRequest = {
                resource: '/resource',
                path: '/resource',
                httpMethod: 'GET',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: null,
              };
              const factory = (error) => () => {
                throw error;
              };
              const handler = { schemas: { request, response }, factory };
              const handlers = { handler };

              describe('- unexpected error', () => {
                it('should return status 500 and JSON error', async () => {
                  const context = new Error('unexpected error');
                  const { handler: gatewayHandler } = createGatewayHandlers({
                    handlers,
                    context,
                  });
                  const { statusCode, body } = await gatewayHandler(
                    restApiRequest,
                  );
                  expect(statusCode).toBe(500);
                  expect(body).toBe(
                    JSON.stringify({ message: 'Internal Server Error' }),
                  );
                });
              });

              describe('- domain error', () => {
                it('should return status 500 and JSON error', async () => {
                  const context = new errors.Domain('domain error');
                  const { handler: gatewayHandler } = createGatewayHandlers({
                    handlers,
                    context,
                  });
                  const { statusCode, body } = await gatewayHandler(
                    restApiRequest,
                  );
                  expect(statusCode).toBe(400);
                  expect(body).toBe(
                    JSON.stringify({
                      message: `Bad Request: ${context.message}`,
                    }),
                  );
                });
              });

              describe('- NotFound error', () => {
                const context = new errors.NotFound('test error');
                const { handler: gatewayHandler } = createGatewayHandlers({
                  handlers,
                  context,
                });

                it('should return status 403', async () => {
                  const { statusCode, body } = await gatewayHandler(
                    restApiRequest,
                  );
                  expect(statusCode).toBe(404);
                  expect(body).toBe(
                    JSON.stringify({ message: context.message }),
                  );
                });
              });
            });
          });

          describe('when passed request has incorrect:', () => {
            describe('- method', () => {
              const restApiRequest = {
                resource: '/resource',
                path: '/resource',
                httpMethod: 'UNEXPECTED_METHOD',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: null,
              };

              it('should return status 400', async () => {
                const { statusCode } = await gatewayHandler(restApiRequest);
                expect(statusCode).toBe(400);
              });

              it('should return JSON error', async () => {
                const { body } = await gatewayHandler(restApiRequest);
                expect(body).toBe(
                  JSON.stringify({
                    message:
                      'Bad Request: method "UNEXPECTED_METHOD" not implemented',
                  }),
                );
              });
            });

            describe('- body', () => {
              const restApiRequest = {
                resource: '/resource',
                path: '/resource',
                httpMethod: 'UNEXPECTED_METHOD',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: ']incorrect body[',
              };

              it('should return status 400', async () => {
                const { statusCode } = await gatewayHandler(restApiRequest);
                expect(statusCode).toBe(400);
              });

              it('should return JSON error', async () => {
                const { body } = await gatewayHandler(restApiRequest);
                expect(body).toBe(
                  JSON.stringify({
                    message: 'Bad Request: "restApi" request is incorrect',
                  }),
                );
              });
            });
          });
        });

        describe('when passed request with incorrect format', () => {
          const restApiRequest = {};

          it('should return status 400', async () => {
            const { statusCode } = await gatewayHandler(restApiRequest);
            expect(statusCode).toBe(400);
          });

          it('should return JSON error', async () => {
            const { body } = await gatewayHandler(restApiRequest);
            expect(body).toBe(
              JSON.stringify({
                message: 'Bad Request: request parser not found',
              }),
            );
          });
        });
      });

      describe('when handler init with request/response schemas', () => {
        const getGatewayHandler = ({ request, response }) => {
          const schemas = { request, response };
          const factory = () => (request) => ({
            statusCode: 200,
            body: request,
          });
          const handler = { schemas, factory };
          const context = {};
          const handlers = { handler };
          const { handler: gatewayHandler } = createGatewayHandlers({
            handlers,
            context,
          });
          return gatewayHandler;
        };

        describe('when handler have a request schema is passed', () => {
          describe('when passed a query request schema', () => {
            const request = {
              $schema: 'http://json-schema.org/draft-07/schema',
              title: 'request',
              type: 'object',
              properties: {
                query: {
                  type: 'object',
                  properties: {
                    prop1: {
                      type: 'string',
                      enum: ['value1', 'value2'],
                    },
                  },
                },
              },
            };
            const schemas = { request };
            const gatewayHandler = getGatewayHandler(schemas);

            describe('when response is valid', () => {
              it('should return success response', async () => {
                const gatewayRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: { prop1: 'value1' },
                  multiValueQueryStringParameters: { prop1: ['value1'] },
                  pathParameters: null,
                  body: null,
                };
                const gatewayResponse = await gatewayHandler(gatewayRequest);
                expect(gatewayResponse.statusCode).toBe(200);
              });
            });

            describe('when response is invalid', () => {
              it('should return bad request response', async () => {
                const gatewayRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: { prop1: 'value3' },
                  multiValueQueryStringParameters: { prop1: ['value3'] },
                  pathParameters: null,
                  body: null,
                };
                const gatewayResponse = await gatewayHandler(gatewayRequest);
                expect(gatewayResponse.statusCode).toBe(400);
                expect(JSON.parse(gatewayResponse.body)).toStrictEqual({
                  message:
                    'Bad Request: An error accure while validating request',
                  errors: [expect.any(Object)],
                });
              });
            });
          });

          describe('when passed a params request schema', () => {
            const request = {
              $schema: 'http://json-schema.org/draft-07/schema',
              title: 'request',
              type: 'object',
              properties: {
                params: {
                  type: 'object',
                  properties: {
                    prop1: {
                      type: 'string',
                      enum: ['value1', 'value2'],
                    },
                  },
                },
              },
            };
            const response = {};
            const schemas = { request, response };
            const gatewayHandler = getGatewayHandler(schemas);

            describe('when response is valid', () => {
              it('should return success response', async () => {
                const gatewayRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: { prop1: 'value1' },
                  body: null,
                };
                const gatewayResponse = await gatewayHandler(gatewayRequest);
                expect(gatewayResponse.statusCode).toBe(200);
              });
            });

            describe('when response is invalid', () => {
              it('should return bad request response', async () => {
                const gatewayRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: { prop1: 'value3' },
                  body: null,
                };
                const gatewayResponse = await gatewayHandler(gatewayRequest);
                expect(gatewayResponse.statusCode).toBe(400);
                expect(JSON.parse(gatewayResponse.body)).toStrictEqual({
                  message:
                    'Bad Request: An error accure while validating request',
                  errors: [expect.any(Object)],
                });
              });
            });
          });

          describe('when passed a body request schema', () => {
            const request = {
              $schema: 'http://json-schema.org/draft-07/schema',
              title: 'request',
              type: 'object',
              properties: {
                body: {
                  type: 'object',
                  properties: {
                    prop1: {
                      type: 'string',
                      enum: ['value1', 'value2'],
                    },
                  },
                },
              },
            };
            const response = {};
            const schemas = { request, response };
            const gatewayHandler = getGatewayHandler(schemas);

            describe('when response is valid', () => {
              it('should return success response', async () => {
                const gatewayRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'POST',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: '{"prop1":"value1"}',
                };
                const gatewayResponse = await gatewayHandler(gatewayRequest);
                expect(gatewayResponse.statusCode).toBe(200);
              });
            });

            describe('when response is invalid', () => {
              it('should return bad request response', async () => {
                const gatewayRequest = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'POST',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: '{"prop1":"value3"}',
                };
                const gatewayResponse = await gatewayHandler(gatewayRequest);
                expect(gatewayResponse.statusCode).toBe(400);
                expect(JSON.parse(gatewayResponse.body)).toStrictEqual({
                  message:
                    'Bad Request: An error accure while validating request',
                  errors: [expect.any(Object)],
                });
              });
            });
          });
        });

        describe('when handler have a response schema is passed', () => {
          const response = {
            $schema: 'http://json-schema.org/draft-07/schema',
            title: 'response',
            type: 'object',
            properties: {
              statusCode: {
                type: 'integer',
                const: 200,
              },
              body: {
                type: 'object',
                properties: {
                  params: {
                    type: 'object',
                    properties: {
                      prop: {
                        type: 'string',
                        const: 'value',
                      },
                    },
                  },
                },
                required: ['params'],
              },
            },
            required: ['statusCode', 'body'],
          };
          const schemas = { response };
          const gatewayHandler = getGatewayHandler(schemas);

          describe('when response is valid', () => {
            it('should return success response', async () => {
              const gatewayRequest = {
                resource: '/resource',
                path: '/resource',
                httpMethod: 'GET',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: { prop: 'value' },
                body: null,
              };
              const gatewayResponse = await gatewayHandler(gatewayRequest);
              expect(gatewayResponse.statusCode).toBe(200);
            });
          });

          describe('when response is invalid', () => {
            it('should return success response and log warning', async () => {
              const logWarnSpy = jest.spyOn(console, 'warn');
              const logDebugSpy = jest.spyOn(console, 'debug');
              const gatewayRequest = {
                resource: '/resource',
                path: '/resource',
                httpMethod: 'GET',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: { prop: 'invalid-value' },
                body: null,
              };
              const gatewayResponse = await gatewayHandler(gatewayRequest);
              expect(gatewayResponse.statusCode).toBe(200);
              expect(logWarnSpy).toHaveBeenCalledTimes(1);
              expect(logDebugSpy).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
    });
  });
});
