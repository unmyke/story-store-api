import { AwsEvents } from '@lib/aws-events';
import { Errors, ErrorTypes } from '@lib/errors';

import { createEventHandlers } from './create-event-handlers';

describe('# @lib/createEventHandlers', () => {
  describe('when no handlers passed', () => {
    it('should return empty object', () => {
      expect.assertions(1);
      const awsEventHandlers = createEventHandlers({
        handlers: {},
        context: {},
      });
      expect(awsEventHandlers).toStrictEqual({});
    });
  });

  describe('when handlers passed', () => {
    it('should pass context to handler factories', () => {
      expect.assertions(4);
      const context = {};
      const eventType = AwsEvents['http-api'].name;
      const event = {};
      const response = {};
      const schemas = { event, response };
      const handler1Factory = jest.fn();
      const handler2Factory = jest.fn();
      const handler1 = { eventType, schemas, factory: handler1Factory };
      const handler2 = { eventType, schemas, factory: handler2Factory };
      const handlers = { handler1, handler2 };
      createEventHandlers({ handlers, context });
      expect(handler1Factory).toHaveBeenCalledTimes(1);
      expect(handler1Factory).toHaveBeenCalledWith(context);
      expect(handler2Factory).toHaveBeenCalledTimes(1);
      expect(handler2Factory).toHaveBeenCalledWith(context);
    });

    describe('when passed handlers with event type', () => {
      it('should return event handlers', () => {
        expect.assertions(2);
        const context = {};
        const awsEventHandler1 = () => {};
        const eventType1 = AwsEvents['http-api'].name;
        const event = {};
        const response = {};
        const schemas = { event, response };
        const handler1Factory = () => awsEventHandler1;
        const handler1 = {
          eventType: eventType1,
          schemas,
          factory: handler1Factory,
        };
        const awsEventHandler2 = () => {};
        const eventType2 = AwsEvents['rest-api'].name;
        const handler2Factory = () => awsEventHandler2;
        const handler2 = {
          eventType: eventType2,
          schemas: { event, response },
          factory: handler2Factory,
        };
        const handlers = { handler1, handler2 };
        const awsEventHandlers = createEventHandlers({ handlers, context });
        expect(awsEventHandlers).toHaveProperty('handler1');
        expect(awsEventHandlers).toHaveProperty('handler2');
      });
    });

    describe('when passed handler without event type', () => {
      it('should return event handlers', () => {
        const context = {};
        const awsEventHandler = () => {};
        const event = {};
        const response = {};
        const schemas = { event, response };
        const handlerFactory = () => awsEventHandler;
        const handler = {
          schemas,
          factory: handlerFactory,
        };
        const handlers = { handler };
        expect(() => createEventHandlers({ handlers, context })).toThrow({
          message: 'Handle "undefined" type not implemented',
          type: ErrorTypes.HANDLER.name,
        });
      });
    });

    describe('## event handler', () => {
      describe('when passed handler have empty event and response schemas', () => {
        describe('when passed http api event', () => {
          const eventType = AwsEvents['http-api'].name;
          const event = {};
          const response = {};
          const schemas = { event, response };
          const factory = () => (event) => ({ statusCode: 200, body: event });
          const handler = { eventType, schemas, factory };
          const context = {};
          const handlers = { handler };
          const { handler: awsEventHandler } = createEventHandlers({
            handlers,
            context,
          });

          describe('when passed event is correct', () => {
            describe('when passed GET event', () => {
              it('should return status 200', async () => {
                const httpApiEvent = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',
                  requestContext: { http: { method: 'GET' } },
                };
                const { statusCode, body } = await awsEventHandler(
                  httpApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, query: {} }),
                );
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with event's params", async () => {
                    const httpApiEvent = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',

                      requestContext: { http: { method: 'GET' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await awsEventHandler(httpApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: httpApiEvent.pathParameters,
                        query: {},
                      }),
                    );
                  });
                });

                describe('- query', () => {
                  describe('when passed single-value params', () => {
                    it("should return JSON body with filter as event's query", async () => {
                      const httpApiEvent = {
                        version: '2.0',
                        routeKey: '/path',
                        rawPath: '/path',

                        requestContext: { http: { method: 'GET' } },
                        queryStringParameters: { test: 'test' },
                      };
                      const { body } = await awsEventHandler(httpApiEvent);
                      expect(body).toBe(
                        JSON.stringify({
                          params: {},
                          query: httpApiEvent.queryStringParameters,
                        }),
                      );
                    });
                  });

                  describe('when passed multi-value params', () => {
                    it("should return JSON body with filter as event's query", async () => {
                      const httpApiEvent = {
                        version: '2.0',
                        routeKey: '/path',
                        rawPath: '/path',

                        requestContext: { http: { method: 'GET' } },
                        queryStringParameters: { test: 'test1,test2' },
                      };
                      const { body } = await awsEventHandler(httpApiEvent);
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

            describe('when passed POST event', () => {
              it('should return status 200', async () => {
                const httpApiEvent = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',

                  requestContext: { http: { method: 'POST' } },
                };
                const { statusCode, body } = await awsEventHandler(
                  httpApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  event's params", async () => {
                    const httpApiEvent = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',

                      requestContext: { http: { method: 'POST' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await awsEventHandler(httpApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: httpApiEvent.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as event's body", async () => {
                    const httpApiEvent = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'POST' } },
                      body: JSON.stringify({ test: 'test' }),
                    };
                    const { body } = await awsEventHandler(httpApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(httpApiEvent.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed PUT event', () => {
              it('should return status 200', async () => {
                const httpApiEvent = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',
                  requestContext: { http: { method: 'PUT' } },
                };
                const { statusCode, body } = await awsEventHandler(
                  httpApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  event's params", async () => {
                    const httpApiEvent = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'PUT' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await awsEventHandler(httpApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: httpApiEvent.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as event's body", async () => {
                    const httpApiEvent = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'PUT' } },
                      body: JSON.stringify({ test: 'test' }),
                    };
                    const { body } = await awsEventHandler(httpApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(httpApiEvent.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed PATCH event', () => {
              it('should return status 200', async () => {
                const httpApiEvent = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',
                  requestContext: { http: { method: 'PATCH' } },
                };
                const { statusCode, body } = await awsEventHandler(
                  httpApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  event's params", async () => {
                    const httpApiEvent = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'PATCH' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await awsEventHandler(httpApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: httpApiEvent.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as event's body", async () => {
                    const httpApiEvent = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'PATCH' } },
                      body: JSON.stringify({ test: 'test' }),
                    };
                    const { body } = await awsEventHandler(httpApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(httpApiEvent.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed DELETE event', () => {
              it('should return status 200', async () => {
                const httpApiEvent = {
                  version: '2.0',
                  routeKey: '/path',
                  rawPath: '/path',
                  requestContext: { http: { method: 'DELETE' } },
                };
                const { statusCode, body } = await awsEventHandler(
                  httpApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(JSON.stringify({ params: {} }));
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  event's params", async () => {
                    const httpApiEvent = {
                      version: '2.0',
                      routeKey: '/path',
                      rawPath: '/path',
                      requestContext: { http: { method: 'DELETE' } },
                      pathParameters: { test: 'test' },
                    };
                    const { body } = await awsEventHandler(httpApiEvent);
                    expect(body).toBe(
                      JSON.stringify({ params: httpApiEvent.pathParameters }),
                    );
                  });
                });
              });
            });

            describe('when handler throw with:', () => {
              const httpApiEvent = {
                version: '2.0',
                routeKey: '/path',
                rawPath: '/path',
                requestContext: { http: { method: 'GET' } },
              };
              const factory = (error) => () => {
                throw error;
              };
              const handler = {
                eventType,
                schemas: { event, response },
                factory,
              };
              const handlers = { handler };

              describe('- unexpected error', () => {
                it('should return status 500 and JSON error', async () => {
                  const context = new Error('unexpected error');
                  const { handler: awsEventHandler } = createEventHandlers({
                    handlers,
                    context,
                  });
                  const { statusCode, body } = await awsEventHandler(
                    httpApiEvent,
                  );
                  expect(statusCode).toBe(500);
                  expect(body).toBe(
                    JSON.stringify({ message: 'Internal Server Error' }),
                  );
                });
              });

              describe('- domain error', () => {
                it('should return status 500 and JSON error', async () => {
                  const context = new Errors.Domain('domain error');
                  const { handler: awsEventHandler } = createEventHandlers({
                    handlers,
                    context,
                  });
                  const { statusCode, body } = await awsEventHandler(
                    httpApiEvent,
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
                const context = new Errors.NotFound('test error');
                const { handler: awsEventHandler } = createEventHandlers({
                  handlers,
                  context,
                });

                it('should return status 403', async () => {
                  const { statusCode, body } = await awsEventHandler(
                    httpApiEvent,
                  );
                  expect(statusCode).toBe(404);
                  expect(body).toBe(
                    JSON.stringify({ message: context.message }),
                  );
                });
              });
            });
          });

          describe('when passed event has incorrect:', () => {
            describe('- method', () => {
              const httpApiEvent = {
                version: '2.0',
                routeKey: '/path',
                rawPath: '/path',
                requestContext: { http: { method: 'UNEXPECTED_METHOD' } },
              };

              it('should return status 400', async () => {
                const { statusCode } = await awsEventHandler(httpApiEvent);
                expect(statusCode).toBe(400);
              });

              it('should return JSON error', async () => {
                const { body } = await awsEventHandler(httpApiEvent);
                expect(body).toBe(
                  JSON.stringify({
                    message:
                      'Bad Request: method "UNEXPECTED_METHOD" not implemented',
                  }),
                );
              });
            });

            describe('- body', () => {
              const httpApiEvent = {
                version: '2.0',
                routeKey: '/path',
                rawPath: '/path',
                requestContext: { http: { method: 'POST' } },
                body: ']incorrect body[',
              };

              it('should return status 400', async () => {
                const { statusCode } = await awsEventHandler(httpApiEvent);
                expect(statusCode).toBe(400);
              });

              it('should return JSON error', async () => {
                const { body } = await awsEventHandler(httpApiEvent);
                expect(body).toBe(
                  JSON.stringify({
                    message: 'Bad Request: "http-api" event is incorrect',
                  }),
                );
              });
            });
          });
        });

        describe('when passed rest api event', () => {
          const eventType = AwsEvents['rest-api'].name;
          const event = {};
          const response = {};
          const schemas = { event, response };
          const factory = () => (event) => ({ statusCode: 200, body: event });
          const handler = { eventType, schemas, factory };
          const context = {};
          const handlers = { handler };
          const { handler: awsEventHandler } = createEventHandlers({
            handlers,
            context,
          });

          describe('when passed event is correct', () => {
            describe('when passed GET event', () => {
              it('should return status 200', async () => {
                const restApiEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await awsEventHandler(
                  restApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, query: {} }),
                );
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with event's params", async () => {
                    const restApiEvent = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'GET',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param: 'value' },
                      body: null,
                    };
                    const { body } = await awsEventHandler(restApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: restApiEvent.pathParameters,
                        query: {},
                      }),
                    );
                  });
                });

                describe('- query', () => {
                  it("should return JSON body with filter as event's query", async () => {
                    const restApiEvent = {
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
                    const { body } = await awsEventHandler(restApiEvent);
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

            describe('when passed POST event', () => {
              it('should return status 200', async () => {
                const restApiEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'POST',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await awsEventHandler(
                  restApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  event's params", async () => {
                    const restApiEvent = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'POST',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param1: 'value1', param2: 'value2' },
                      body: null,
                    };
                    const { body } = await awsEventHandler(restApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: restApiEvent.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as event's body", async () => {
                    const restApiEvent = {
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
                    const { body } = await awsEventHandler(restApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(restApiEvent.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed PUT event', () => {
              it('should return status 200', async () => {
                const restApiEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'PUT',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await awsEventHandler(
                  restApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  event's params", async () => {
                    const restApiEvent = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'PUT',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param1: 'value1', param2: 'value2' },
                      body: null,
                    };
                    const { body } = await awsEventHandler(restApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: restApiEvent.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as event's body", async () => {
                    const restApiEvent = {
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
                    const { body } = await awsEventHandler(restApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(restApiEvent.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed PATCH event', () => {
              it('should return status 200', async () => {
                const restApiEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'PATCH',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await awsEventHandler(
                  restApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toStrictEqual(
                  JSON.stringify({ params: {}, body: {} }),
                );
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  event's params", async () => {
                    const restApiEvent = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'PATCH',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param1: 'value1', param2: 'value2' },
                      body: null,
                    };
                    const { body } = await awsEventHandler(restApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: restApiEvent.pathParameters,
                        body: {},
                      }),
                    );
                  });
                });

                describe('- body', () => {
                  it("should return JSON body with body as event's body", async () => {
                    const restApiEvent = {
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
                    const { body } = await awsEventHandler(restApiEvent);
                    expect(body).toBe(
                      JSON.stringify({
                        params: {},
                        body: JSON.parse(restApiEvent.body),
                      }),
                    );
                  });
                });
              });
            });

            describe('when passed DELETE event', () => {
              it('should return status 200', async () => {
                const restApiEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'DELETE',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: null,
                };
                const { statusCode, body } = await awsEventHandler(
                  restApiEvent,
                );
                expect(statusCode).toBe(200);
                expect(body).toBe('{"params":{}}');
              });

              describe('when handler retruns event and event contains:', () => {
                describe('- params', () => {
                  it("should return JSON body with  event's params", async () => {
                    const restApiEvent = {
                      resource: '/resource',
                      path: '/resource',
                      httpMethod: 'DELETE',
                      queryStringParameters: null,
                      multiValueQueryStringParameters: null,
                      pathParameters: { param1: 'value1', param2: 'value2' },
                      body: null,
                    };
                    const { body } = await awsEventHandler(restApiEvent);
                    expect(body).toBe(
                      JSON.stringify({ params: restApiEvent.pathParameters }),
                    );
                  });
                });
              });
            });

            describe('when handler throw with:', () => {
              const restApiEvent = {
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
              const handler = {
                eventType,
                schemas: { event, response },
                factory,
              };
              const handlers = { handler };

              describe('- unexpected error', () => {
                it('should return status 500 and JSON error', async () => {
                  const context = new Error('unexpected error');
                  const { handler: awsEventHandler } = createEventHandlers({
                    handlers,
                    context,
                  });
                  const { statusCode, body } = await awsEventHandler(
                    restApiEvent,
                  );
                  expect(statusCode).toBe(500);
                  expect(body).toBe(
                    JSON.stringify({ message: 'Internal Server Error' }),
                  );
                });
              });

              describe('- domain error', () => {
                it('should return status 500 and JSON error', async () => {
                  const context = new Errors.Domain('domain error');
                  const { handler: awsEventHandler } = createEventHandlers({
                    handlers,
                    context,
                  });
                  const { statusCode, body } = await awsEventHandler(
                    restApiEvent,
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
                const context = new Errors.NotFound('test error');
                const { handler: awsEventHandler } = createEventHandlers({
                  handlers,
                  context,
                });

                it('should return status 403', async () => {
                  const { statusCode, body } = await awsEventHandler(
                    restApiEvent,
                  );
                  expect(statusCode).toBe(404);
                  expect(body).toBe(
                    JSON.stringify({ message: context.message }),
                  );
                });
              });
            });
          });

          describe('when passed event has incorrect:', () => {
            describe('- method', () => {
              const restApiEvent = {
                resource: '/resource',
                path: '/resource',
                httpMethod: 'UNEXPECTED_METHOD',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: null,
              };

              it('should return status 400', async () => {
                const { statusCode } = await awsEventHandler(restApiEvent);
                expect(statusCode).toBe(400);
              });

              it('should return JSON error', async () => {
                const { body } = await awsEventHandler(restApiEvent);
                expect(body).toBe(
                  JSON.stringify({
                    message:
                      'Bad Request: method "UNEXPECTED_METHOD" not implemented',
                  }),
                );
              });
            });

            describe('- body', () => {
              const restApiEvent = {
                resource: '/resource',
                path: '/resource',
                httpMethod: 'UNEXPECTED_METHOD',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: null,
                body: ']incorrect body[',
              };

              it('should return status 400', async () => {
                const { statusCode } = await awsEventHandler(restApiEvent);
                expect(statusCode).toBe(400);
              });

              it('should return JSON error', async () => {
                const { body } = await awsEventHandler(restApiEvent);
                expect(body).toBe(
                  JSON.stringify({
                    message: 'Bad Request: "rest-api" event is incorrect',
                  }),
                );
              });
            });
          });
        });

        describe('when passed event with incorrect format', () => {
          const eventType = AwsEvents['rest-api'].name;
          const event = {};
          const response = {};
          const schemas = { event, response };
          const factory = () => (event) => ({ statusCode: 200, body: event });
          const handler = { eventType, schemas, factory };
          const context = {};
          const handlers = { handler };
          const { handler: awsEventHandler } = createEventHandlers({
            handlers,
            context,
          });

          describe('when passed epmty event', () => {
            const restApiEvent = {};

            it('should return status 400', async () => {
              const { statusCode, body } = await awsEventHandler(restApiEvent);
              expect(statusCode).toBe(400);
              expect(JSON.parse(body)).toStrictEqual({
                message:
                  'Bad Request: An error accure while validating AWS HTTP API event',
                errors: expect.any(Array),
              });
            });
          });

          describe('when passed event format incompatible with event type', () => {
            const httpApiEvent = {
              version: '2.0',
              routeKey: '/path',
              rawPath: '/path',
              requestContext: { http: { method: 'GET' } },
            };

            it('should return status 400', async () => {
              const { statusCode, body } = await awsEventHandler(httpApiEvent);
              expect(statusCode).toBe(400);
              expect(JSON.parse(body)).toStrictEqual({
                message:
                  'Bad Request: An error accure while validating AWS HTTP API event',
                errors: expect.any(Array),
              });
            });
          });
        });
      });

      describe('when handler init with event/response schemas', () => {
        const getEventHandler = ({ event, response }) => {
          const schemas = { event, response };
          const factory = () => (event) => ({
            statusCode: 200,
            body: event,
          });
          const eventType = AwsEvents['rest-api'].name;
          const handler = { eventType, schemas, factory };
          const context = {};
          const handlers = { handler };
          const { handler: awsEventHandler } = createEventHandlers({
            handlers,
            context,
          });
          return awsEventHandler;
        };

        describe('when handler have a event schema is passed', () => {
          describe('when passed a query event schema', () => {
            const event = {
              $schema: 'http://json-schema.org/draft-07/schema',
              title: 'event',
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
            const schemas = { event };
            const awsEventHandler = getEventHandler(schemas);

            describe('when response is valid', () => {
              it('should return success response', async () => {
                const awsEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: { prop1: 'value1' },
                  multiValueQueryStringParameters: { prop1: ['value1'] },
                  pathParameters: null,
                  body: null,
                };
                const awsResponse = await awsEventHandler(awsEvent);
                expect(awsResponse.statusCode).toBe(200);
              });
            });

            describe('when response is invalid', () => {
              it('should return bad response', async () => {
                const awsEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: { prop1: 'value3' },
                  multiValueQueryStringParameters: { prop1: ['value3'] },
                  pathParameters: null,
                  body: null,
                };
                const awsResponse = await awsEventHandler(awsEvent);
                expect(awsResponse.statusCode).toBe(400);
                expect(JSON.parse(awsResponse.body)).toStrictEqual({
                  message:
                    'Bad Request: An error accure while validating event',
                  errors: [expect.any(Object)],
                });
              });
            });
          });

          describe('when passed a params event schema', () => {
            const event = {
              $schema: 'http://json-schema.org/draft-07/schema',
              title: 'event',
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
            const schemas = { event, response };
            const awsEventHandler = getEventHandler(schemas);

            describe('when response is valid', () => {
              it('should return success response', async () => {
                const awsEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: { prop1: 'value1' },
                  body: null,
                };
                const awsResponse = await awsEventHandler(awsEvent);
                expect(awsResponse.statusCode).toBe(200);
              });
            });

            describe('when response is invalid', () => {
              it('should return bad response', async () => {
                const awsEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'GET',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: { prop1: 'value3' },
                  body: null,
                };
                const awsResponse = await awsEventHandler(awsEvent);
                expect(awsResponse.statusCode).toBe(400);
                expect(JSON.parse(awsResponse.body)).toStrictEqual({
                  message:
                    'Bad Request: An error accure while validating event',
                  errors: [expect.any(Object)],
                });
              });
            });
          });

          describe('when passed a body event schema', () => {
            const event = {
              $schema: 'http://json-schema.org/draft-07/schema',
              title: 'event',
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
            const schemas = { event, response };
            const awsEventHandler = getEventHandler(schemas);

            describe('when response is valid', () => {
              it('should return success response', async () => {
                const awsEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'POST',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: '{"prop1":"value1"}',
                };
                const awsResponse = await awsEventHandler(awsEvent);
                expect(awsResponse.statusCode).toBe(200);
              });
            });

            describe('when response is invalid', () => {
              it('should return bad response', async () => {
                const awsEvent = {
                  resource: '/resource',
                  path: '/resource',
                  httpMethod: 'POST',
                  queryStringParameters: null,
                  multiValueQueryStringParameters: null,
                  pathParameters: null,
                  body: '{"prop1":"value3"}',
                };
                const awsResponse = await awsEventHandler(awsEvent);
                expect(awsResponse.statusCode).toBe(400);
                expect(JSON.parse(awsResponse.body)).toStrictEqual({
                  message:
                    'Bad Request: An error accure while validating event',
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
          const awsEventHandler = getEventHandler(schemas);

          describe('when response is valid', () => {
            it('should return success response', async () => {
              const awsEvent = {
                resource: '/resource',
                path: '/resource',
                httpMethod: 'GET',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: { prop: 'value' },
                body: null,
              };
              const awsResponse = await awsEventHandler(awsEvent);
              expect(awsResponse.statusCode).toBe(200);
            });
          });

          describe('when response is invalid', () => {
            it('should return success response and log warning', async () => {
              const logWarnSpy = jest.spyOn(console, 'warn');
              const logDebugSpy = jest.spyOn(console, 'debug');
              const awsEvent = {
                resource: '/resource',
                path: '/resource',
                httpMethod: 'GET',
                queryStringParameters: null,
                multiValueQueryStringParameters: null,
                pathParameters: { prop: 'invalid-value' },
                body: null,
              };
              const awsResponse = await awsEventHandler(awsEvent);
              expect(awsResponse.statusCode).toBe(200);
              expect(logWarnSpy).toHaveBeenCalledTimes(1);
              expect(logDebugSpy).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
    });
  });
});
