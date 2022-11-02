CREATE TABLE IF NOT EXISTS products(
    id uuid,
    title varchar(50) NOT NULL,
    description varchar(255),
    price int,
    PRIMARY KEY(id)
);
