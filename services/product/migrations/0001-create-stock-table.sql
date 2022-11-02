CREATE TABLE IF NOT EXISTS stocks(
    product_id uuid,
    count int,
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products(id)
);
