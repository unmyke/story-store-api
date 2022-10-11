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
      const handler1Factory = jest.fn();
      const handler2Factory = jest.fn();
      const handlers = { handler1: handler1Factory, handler2: handler2Factory };
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
      const handler1Factory = () => gatewayHandler1;
      const gatewayHandler2 = () => {};
      const handler2Factory = () => gatewayHandler2;
      const handlers = { handler1: handler1Factory, handler2: handler2Factory };
      const gatewayHandlers = createGatewayHandlers({ handlers, context });
      expect(gatewayHandlers).toHaveProperty('handler1');
      expect(gatewayHandlers).toHaveProperty('handler2');
    });

    describe('## gateway handler', () => {
      const handler = () => (request) => request;
      const context = {};
      const handlers = { handler };
      const { handler: gatewayHandler } = createGatewayHandlers({
        handlers,
        context,
      });

      describe('when passed http api request', () => {
        describe('when passed request is correct', () => {
          describe('when passed GET request', () => {
            it('should return status 201', async () => {
              const httpApiRequest = {
                version: '2.0',
                requestContext: { http: { method: 'GET' } },
              };
              const { statusCode, body } = await gatewayHandler(httpApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toStrictEqual(JSON.stringify({ filter: {} }));
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with request's params", async () => {
                  const httpApiRequest = {
                    version: '2.0',
                    requestContext: { http: { method: 'GET' } },
                    pathParameters: { test: 'test' },
                  };
                  const { body } = await gatewayHandler(httpApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      ...httpApiRequest.pathParameters,
                      filter: {},
                    }),
                  );
                });
              });

              describe('- query', () => {
                describe('when passed single-value params', () => {
                  it("should return JSON body with filter as request's query", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      requestContext: { http: { method: 'GET' } },
                      queryStringParameters: { test: 'test' },
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        filter: httpApiRequest.queryStringParameters,
                      }),
                    );
                  });
                });

                describe('when passed multi-value params', () => {
                  it("should return JSON body with filter as request's query", async () => {
                    const httpApiRequest = {
                      version: '2.0',
                      requestContext: { http: { method: 'GET' } },
                      queryStringParameters: { test: 'test1,test2' },
                    };
                    const { body } = await gatewayHandler(httpApiRequest);
                    expect(body).toBe(
                      JSON.stringify({
                        filter: { test: ['test1', 'test2'] },
                      }),
                    );
                  });
                });
              });
            });
          });

          describe('when passed POST request', () => {
            it('should return status 201', async () => {
              const httpApiRequest = {
                version: '2.0',
                requestContext: { http: { method: 'POST' } },
              };
              const { statusCode, body } = await gatewayHandler(httpApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toStrictEqual(JSON.stringify({ payload: {} }));
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with  request's params", async () => {
                  const httpApiRequest = {
                    version: '2.0',
                    requestContext: { http: { method: 'POST' } },
                    pathParameters: { test: 'test' },
                  };
                  const { body } = await gatewayHandler(httpApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      ...httpApiRequest.pathParameters,
                      payload: {},
                    }),
                  );
                });
              });

              describe('- body', () => {
                it("should return JSON body with payload as request's body", async () => {
                  const httpApiRequest = {
                    version: '2.0',
                    requestContext: { http: { method: 'POST' } },
                    body: JSON.stringify({ test: 'test' }),
                  };
                  const { body } = await gatewayHandler(httpApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      payload: JSON.parse(httpApiRequest.body),
                    }),
                  );
                });
              });
            });
          });

          describe('when passed PUT request', () => {
            it('should return status 201', async () => {
              const httpApiRequest = {
                version: '2.0',
                requestContext: { http: { method: 'PUT' } },
              };
              const { statusCode, body } = await gatewayHandler(httpApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toStrictEqual(JSON.stringify({ payload: {} }));
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with  request's params", async () => {
                  const httpApiRequest = {
                    version: '2.0',
                    requestContext: { http: { method: 'PUT' } },
                    pathParameters: { test: 'test' },
                  };
                  const { body } = await gatewayHandler(httpApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      ...httpApiRequest.pathParameters,
                      payload: {},
                    }),
                  );
                });
              });

              describe('- body', () => {
                it("should return JSON body with payload as request's body", async () => {
                  const httpApiRequest = {
                    version: '2.0',
                    requestContext: { http: { method: 'PUT' } },
                    body: JSON.stringify({ test: 'test' }),
                  };
                  const { body } = await gatewayHandler(httpApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      payload: JSON.parse(httpApiRequest.body),
                    }),
                  );
                });
              });
            });
          });

          describe('when passed PATCH request', () => {
            it('should return status 201', async () => {
              const httpApiRequest = {
                version: '2.0',
                requestContext: { http: { method: 'PATCH' } },
              };
              const { statusCode, body } = await gatewayHandler(httpApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toStrictEqual(JSON.stringify({ payload: {} }));
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with  request's params", async () => {
                  const httpApiRequest = {
                    version: '2.0',
                    requestContext: { http: { method: 'PATCH' } },
                    pathParameters: { test: 'test' },
                  };
                  const { body } = await gatewayHandler(httpApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      ...httpApiRequest.pathParameters,
                      payload: {},
                    }),
                  );
                });
              });

              describe('- body', () => {
                it("should return JSON body with payload as request's body", async () => {
                  const httpApiRequest = {
                    version: '2.0',
                    requestContext: { http: { method: 'PATCH' } },
                    body: JSON.stringify({ test: 'test' }),
                  };
                  const { body } = await gatewayHandler(httpApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      payload: JSON.parse(httpApiRequest.body),
                    }),
                  );
                });
              });
            });
          });

          describe('when passed DELETE request', () => {
            it('should return status 201', async () => {
              const httpApiRequest = {
                version: '2.0',
                requestContext: { http: { method: 'DELETE' } },
              };
              const { statusCode, body } = await gatewayHandler(httpApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toStrictEqual(JSON.stringify({}));
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with  request's params", async () => {
                  const httpApiRequest = {
                    version: '2.0',
                    requestContext: { http: { method: 'DELETE' } },
                    pathParameters: { test: 'test' },
                  };
                  const { body } = await gatewayHandler(httpApiRequest);
                  expect(body).toBe(
                    JSON.stringify(httpApiRequest.pathParameters),
                  );
                });
              });
            });
          });

          describe('when handler throw with:', () => {
            const httpApiRequest = {
              version: '2.0',
              requestContext: { http: { method: 'GET' } },
            };
            const handler = (error) => () => {
              throw error;
            };
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
                expect(body).toBe(JSON.stringify({ message: context.message }));
              });
            });
          });
        });

        describe('when passed request has incorrect:', () => {
          const handler = () => (request) => request;
          const context = {};
          const handlers = { handler };
          const { handler: gatewayHandler } = createGatewayHandlers({
            handlers,
            context,
          });

          describe('- method', () => {
            const httpApiRequest = {
              version: '2.0',
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
            it('should return status 201', async () => {
              const restApiRequest = {
                resource: '/resource',
                httpMethod: 'GET',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: null,
              };
              const { statusCode, body } = await gatewayHandler(restApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toStrictEqual(JSON.stringify({ filter: {} }));
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with request's params", async () => {
                  const restApiRequest = {
                    resource: '/resource',
                    httpMethod: 'GET',
                    queryStringParameters: null,
                    multiValueQueryStringParameters: null,
                    pathParameters: { param: 'value' },
                    body: null,
                  };
                  const { body } = await gatewayHandler(restApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      ...restApiRequest.pathParameters,
                      filter: {},
                    }),
                  );
                });
              });

              describe('- query', () => {
                it("should return JSON body with filter as request's query", async () => {
                  const restApiRequest = {
                    resource: '/resource',
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
                      filter: {
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
            it('should return status 201', async () => {
              const restApiRequest = {
                resource: '/resource',
                httpMethod: 'POST',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: null,
              };
              const { statusCode, body } = await gatewayHandler(restApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toStrictEqual(JSON.stringify({ payload: {} }));
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with  request's params", async () => {
                  const restApiRequest = {
                    resource: '/resource',
                    httpMethod: 'POST',
                    queryStringParameters: null,
                    multiValueQueryStringParameters: null,
                    pathParameters: { param1: 'value1', param2: 'value2' },
                    body: null,
                  };
                  const { body } = await gatewayHandler(restApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      ...restApiRequest.pathParameters,
                      payload: {},
                    }),
                  );
                });
              });

              describe('- body', () => {
                it("should return JSON body with payload as request's body", async () => {
                  const restApiRequest = {
                    resource: '/resource',
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
                      payload: JSON.parse(restApiRequest.body),
                    }),
                  );
                });
              });
            });
          });

          describe('when passed PUT request', () => {
            it('should return status 201', async () => {
              const restApiRequest = {
                resource: '/resource',
                httpMethod: 'PUT',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: null,
              };
              const { statusCode, body } = await gatewayHandler(restApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toStrictEqual(JSON.stringify({ payload: {} }));
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with  request's params", async () => {
                  const restApiRequest = {
                    resource: '/resource',
                    httpMethod: 'PUT',
                    queryStringParameters: null,
                    multiValueQueryStringParameters: null,
                    pathParameters: { param1: 'value1', param2: 'value2' },
                    body: null,
                  };
                  const { body } = await gatewayHandler(restApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      ...restApiRequest.pathParameters,
                      payload: {},
                    }),
                  );
                });
              });

              describe('- body', () => {
                it("should return JSON body with payload as request's body", async () => {
                  const restApiRequest = {
                    resource: '/resource',
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
                      payload: JSON.parse(restApiRequest.body),
                    }),
                  );
                });
              });
            });
          });

          describe('when passed PATCH request', () => {
            it('should return status 201', async () => {
              const restApiRequest = {
                resource: '/resource',
                httpMethod: 'PATCH',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: null,
              };
              const { statusCode, body } = await gatewayHandler(restApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toStrictEqual(JSON.stringify({ payload: {} }));
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with  request's params", async () => {
                  const restApiRequest = {
                    resource: '/resource',
                    httpMethod: 'PATCH',
                    queryStringParameters: null,
                    multiValueQueryStringParameters: null,
                    pathParameters: { param1: 'value1', param2: 'value2' },
                    body: null,
                  };
                  const { body } = await gatewayHandler(restApiRequest);
                  expect(body).toBe(
                    JSON.stringify({
                      ...restApiRequest.pathParameters,
                      payload: {},
                    }),
                  );
                });
              });

              describe('- body', () => {
                it("should return JSON body with payload as request's body", async () => {
                  const restApiRequest = {
                    resource: '/resource',
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
                      payload: JSON.parse(restApiRequest.body),
                    }),
                  );
                });
              });
            });
          });

          describe('when passed DELETE request', () => {
            it('should return status 201', async () => {
              const restApiRequest = {
                resource: '/resource',
                httpMethod: 'DELETE',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: null,
              };
              const { statusCode, body } = await gatewayHandler(restApiRequest);
              expect(statusCode).toBe(201);
              expect(body).toBe('{}');
            });

            describe('when handler retruns input and request contains:', () => {
              describe('- params', () => {
                it("should return JSON body with  request's params", async () => {
                  const restApiRequest = {
                    resource: '/resource',
                    httpMethod: 'DELETE',
                    queryStringParameters: null,
                    multiValueQueryStringParameters: null,
                    pathParameters: { param1: 'value1', param2: 'value2' },
                    body: null,
                  };
                  const { body } = await gatewayHandler(restApiRequest);
                  expect(body).toBe(
                    JSON.stringify(restApiRequest.pathParameters),
                  );
                });
              });
            });
          });

          describe('when handler throw with:', () => {
            const restApiRequest = {
              resource: '/resource',
              httpMethod: 'GET',
              queryStringParameters: null,
              multiValueQueryStringParameters: null,
              pathParameters: null,
              body: null,
            };
            const handler = (error) => () => {
              throw error;
            };
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
                expect(body).toBe(JSON.stringify({ message: context.message }));
              });
            });
          });
        });

        describe('when passed request has incorrect:', () => {
          const handler = () => (request) => request;
          const context = {};
          const handlers = { handler };
          const { handler: gatewayHandler } = createGatewayHandlers({
            handlers,
            context,
          });

          describe('- method', () => {
            const restApiRequest = {
              resource: '/resource',
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
  });
});
