export const createProducts =
  ({ transaction }) =>
  async (products) => {
    const { productSql, stockSql } = toSql(products);
    await transaction(async (atomicQuery) => {
      const productQuery = `
        INSERT INTO
          products(${productSql.fields})
        VALUES ${productSql.params}
      `;
      await atomicQuery(productQuery, productSql.values);
      const stockQuery = `
        INSERT INTO 
          stocks(${stockSql.fields}) 
          VALUES ${stockSql.params}
        `;
      await atomicQuery(stockQuery, stockSql.values);
    });
  };

const toSql = (products) => {
  const { productRows, stockRows } = splitToTables(products);
  const productSql = toParamsAndValues(productRows);
  const stockSql = toParamsAndValues(stockRows);
  return { productSql, stockSql };
};

const splitToTables = (products) => {
  const [productRows, stockRows] = products
    .map(({ id, title, description, price, count }) => {
      return [
        { id, title, description, price },
        { product_id: id, count },
      ];
    })
    .reduce(
      ([prevProductRows, prevStockRows], [product, stock]) => {
        return [
          [...prevProductRows, product],
          [...prevStockRows, stock],
        ];
      },
      [[], []],
    );
  return { productRows, stockRows };
};

const toParamsAndValues = (rows) => {
  const fields = Object.keys(rows[0]);
  let paramCount = 0;
  let params = [];
  let values = [];
  for (const row of rows) {
    const paramsGroup = [];
    for (const field of fields) {
      const value = row[field];
      values.push(value);
      paramsGroup.push(`$${++paramCount}`);
    }
    params.push(`(${paramsGroup.join(', ')})`);
  }
  return {
    fields: fields.join(', '),
    params: params.join(', '),
    values,
  };
};
