import { createValidate } from '@lib/create-validate';
import { Errors } from '@lib/errors';

import * as db from './db';
import * as uploadStore from './upload-store';
import * as eventBus from './event-bus';
import * as queues from './queues';
import * as notifier from './notifier';
import { ConfigSections } from './constants';

const availableSections = {
  [ConfigSections.DB]: db,
  [ConfigSections.UPLOAD_STORE]: uploadStore,
  [ConfigSections.EVENT_BUS]: eventBus,
  [ConfigSections.QUEUES]: queues,
  [ConfigSections.NOTIFIER]: notifier,
};

export const createConfig = (...sections) => {
  if (!sections.length) return {};
  for (const section of sections) {
    if (!isValidSection(section))
      throw new Errors.Config(`Config section "${section}" in not exists`);
  }

  const configEntrires = sections.map((section) => {
    const { schema, factory } = availableSections[section];
    const config = factory();
    const validate = createValidate(schema);
    return [section, { validate, config }];
  });
  for (const [section, { validate, config }] of configEntrires) {
    try {
      validate(config);
    } catch (error) {
      throw new Errors.Config(
        `An error accure while validating ${section} configuration`,
        error,
      );
    }
  }
  return Object.fromEntries(
    configEntrires.map(([section, { config }]) => [section, config]),
  );
};

const AVAILABLE_SECTIONS = Object.values(ConfigSections);
const isValidSection = (section) => AVAILABLE_SECTIONS.includes(section);
