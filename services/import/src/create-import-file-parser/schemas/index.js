import s3event from './event.json';

export const schemas = {
  event: { schema: s3event, references: [] },
};
