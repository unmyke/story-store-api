export const createGetProductById =
  ({ query }) =>
  async ({ id }) => {
    return query.getProduct(id);
  };
