import { getProduct, getProducts, createProduct } from './methods';

export const createRepo = ({ db }) => {
  return {
    getProduct: getProduct(db),
    getProducts: getProducts(db),
    createProduct: createProduct(db),
  };
};
