import { v4 as uuid } from 'uuid';

export const createCreateProduct =
  ({ repo }) =>
  async ({ body }) => {
    const id = uuid();
    await repo.createProduct({ id, ...body });
    return { statusCode: 201, body: { id } };
  };
