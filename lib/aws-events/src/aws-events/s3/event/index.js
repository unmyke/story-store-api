import awsEventschema from './aws-event-schema.json';
import { toHandlerEvent } from './to-handler-event';

export const event = { awsEventschema, toHandlerEvent };
