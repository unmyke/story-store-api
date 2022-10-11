import { errors } from '@lib/errors';

export const createQuery = ({ db }) => {
  const products = db.select('products');

  const getProducts = async (filter) => {
    const { isEmptyFilter, isMatchToFilter } = createFilterHelpers(filter);
    if (isEmptyFilter()) return products;
    return products.filter(isMatchToFilter);
  };

  return { getProducts };
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
