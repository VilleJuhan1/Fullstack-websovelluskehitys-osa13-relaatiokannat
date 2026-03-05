/* Commands for creating the database and the table, and inserting some data into the table as per exercise 13.2 */
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);
insert into blogs (author, url, title, likes) values ('Matti Meikäläinen', 'https://www.iltalehti.fi', 'Blogit testissä', 5);
insert into blogs (author, url, title) values ('Maija Mehiläinen', 'https://www.iltasanomat.fi', 'Testit blogissa');