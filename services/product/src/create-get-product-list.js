export const createGetProductList =
  ({ query }) =>
  async ({ filter }) => {
    const productsFilter = getFilter(filter);
    return query.getProducts(productsFilter);
  };

const getFilter = (filter = {}) => {
  const availablityFilter =
    filter.available !== undefined ? { count: (count) => count > 0 } : {};
  return { ...availablityFilter };
};
