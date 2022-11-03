export const createProduct =
  ({ transaction }) =>
  async ({ id, title, description, price, count }) => {
    await transaction(async (atomicQuery) => {
      const productQuery = `
        INSERT INTO 
          products(id, title, description, price) 
          VALUES ($1, $2, $3, $4)
      `;
      await atomicQuery(productQuery, [id, title, description, price]);
      const stockQuery = `
        INSERT INTO 
          stocks(product_id, count) 
          VALUES ($1, $2)
        `;
      await atomicQuery(stockQuery, [id, count]);
    });
  };
