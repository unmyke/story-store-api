export const SELECT_PRODUCTS_QUERY = `
  SELECT
    p.id as id,
    p.title as title,
    p.description as description,
    p.price as price,
    s.count as count
  FROM products p
  JOIN stocks s ON p.id = s.product_id
`;
