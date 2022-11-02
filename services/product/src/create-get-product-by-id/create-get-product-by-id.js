export const createGetProductById =
  ({ repo }) =>
  async ({ params: { id } }) => {
    const body = await repo.getProduct(id);
    return { statusCode: 200, body };
  };
