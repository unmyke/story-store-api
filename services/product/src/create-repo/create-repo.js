import {
  getProduct,
  getProducts,
  createProduct,
  createProducts,
} from './methods';

export const createRepo = ({ db }) => {
  return {
    getProduct: getProduct(db),
    getProducts: getProducts(db),
    createProduct: createProduct(db),
    createProducts: createProducts(db),
  };
};
