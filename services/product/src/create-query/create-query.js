import { errors } from '@lib/errors';

export const createQuery = ({ db }) => {
  const products = db.select('products');

  const getProduct = async (productId) => {
    const product = products.find(({ id }) => productId === id);
    if (!product)
      throw new errors.NotFound(`Product with id=${productId} not found`);
    return product;
  };

  const getProducts = async (filter) => {
    const { isEmptyFilter, isMatchToFilter } = createFilterHelpers(filter);
    if (isEmptyFilter()) return products;
    return products.filter(isMatchToFilter);
  };

  return { getProduct, getProducts };
};

const createFilterHelpers = (filter = {}) => {
  const filterEntries = Object.entries(filter);
  const isEmptyFilter = () => filterEntries.length === 0;
  const isMatchToFilter = (item) =>
    filterEntries.every(
      ([field, predicate]) => item[field] && predicate(item[field]),
    );
  return { isEmptyFilter, isMatchToFilter };
};
