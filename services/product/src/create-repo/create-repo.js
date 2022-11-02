import { getProduct, getProducts } from './methods';

export const createRepo = ({ db }) => {
  return {
    getProduct: getProduct(db),
    getProducts: getProducts(db),
  };
};
