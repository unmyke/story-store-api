export const createGetProductList =
  ({ repo }) =>
  async ({ query }) => {
    const filter = toFilter(query);
    const body = await repo.getProducts(filter);
    return { statusCode: 200, body };
  };

const toFilter = (query = {}) => {
  if (query.available === '' || query.available === 'true')
    return { filter: { available: true } };
  if (query.available === 'false') return { filter: { available: false } };
  return { filter: {} };
};
