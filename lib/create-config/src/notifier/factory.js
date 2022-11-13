export const factory = () => {
  const region = process.env['NOTIFIER_REGION'];
  const baseArn = process.env['NOTIFIER_BASE_ARN'];
  const createProduct = process.env['NOTIFIER_CREATE_PRODUCT_TOPIC'];
  const topics = { createProduct };
  return { region, baseArn, topics };
};
