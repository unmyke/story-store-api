import { errors } from '@lib/errors';

import { SELECT_PRODUCTS_QUERY } from './sql-queries';

export const getProduct =
  ({ query }) =>
  async (productId) => {
    const sqlQuery = `${SELECT_PRODUCTS_QUERY} WHERE p.id=$1`;
    const {
      rows: [product],
    } = await query(sqlQuery, [productId]);
    if (!product)
      throw new errors.NotFound(`Product with id "${productId}" not found`);
    return product;
  };
