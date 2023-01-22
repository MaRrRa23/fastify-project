CREATE DATABASE pompelmus;
CREATE USER pompelmus WITH ENCRYPTED PASSWORD 'test';
GRANT ALL PRIVILEGES ON DATABASE pompelmus TO pompelmus;
CREATE TABLE pompelmus.test(
    id int4 GENERATED ALWAYS AS IDENTITY primary key,
    name varchar not null
);
INSERT INTO test (name) VALUES ('123123'), ('123213');