export const factory = () => {
  const catalogItems = process.env['QUEUES_CATALOG_ITEMS'];

  return { catalogItems };
};
