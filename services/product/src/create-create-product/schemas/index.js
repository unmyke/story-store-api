import event from './event.json';
import eventBody from './event-body.json';
import response from './response.json';
import response201 from './response-201.json';

export const schemas = {
  event: { schema: event, references: [eventBody] },
  response: { schema: response, references: [response201] },
};
