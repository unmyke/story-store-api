export const factory = () => {
  const region = process.env['EVENT_BUS_REGION'];
  const baseUrl = process.env['EVENT_BUS_BASE_URL'];

  return { region, baseUrl };
};
