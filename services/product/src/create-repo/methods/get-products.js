import { SELECT_PRODUCTS_QUERY } from './sql-queries';

export const getProducts =
  ({ query }) =>
  async ({ filter }) => {
    const sqlQuery = getSqlQuery(filter);
    const { rows: prodcuts } = await query(sqlQuery);
    return prodcuts;
  };

const getSqlQuery = (filter) => {
  if (Object.entries(filter).length === 0) return SELECT_PRODUCTS_QUERY;
  if (!filter.available) return `${SELECT_PRODUCTS_QUERY} AND s.count = 0`;
  return `${SELECT_PRODUCTS_QUERY} AND s.count > 0`;
};
