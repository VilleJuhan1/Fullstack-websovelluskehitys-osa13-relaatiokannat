Using psql via docker

```shell
docker run -it --rm postgres psql "postgres://userhere:passwordhere@hostnamehere.aivencloud.com:10789/defaultdb?sslmode=require"

psql (17.4 (Debian 17.4-1.pgdg120+2), server 17.7)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off, ALPN: postgresql)
Type "help" for help.

defaultdb=> \d
Did not find any relations.
defaultdb=>CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);

defaultdb=> \d
            List of relations
 Schema |     Name     |   Type   |  Owner
--------+--------------+----------+----------
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
(2 rows)

defaultdb=> \d notes;
                                 Table "public.notes"                                          
 Column    |          Type          | Collation | Nullable |             Default               
-----------+------------------------+-----------+----------+-----------------------------------
 id        | integer                |           | not null | nextval('notes_id_seq'::regclass) 
 content   | text                   |           | not null |                                   
 important | boolean                |           |          |                                   
 date      | time without time zone |           |          |                                   
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)

defaultdb=> insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);

defaultdb=> select * from notes;
 id |               content               | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t         |      
  2 | MongoDB is webscale                 | f         |      
(2 rows)

# Faulty values cannot be added
defaultdb=> insert into notes (important) values (true);
ERROR: null value in column "content" of relation "notes" violates not-null constraint
DETAIL: Failing row contains (9, null, t, null).

defaultdb=> insert into notes (content, important) values ('only valid data can be saved', 1);
ERROR: column "important" is of type boolean but expression is of type integer
LINE 1: ...tent, important) values ('only valid data can be saved', 1); ^

defaultdb=> insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values ('only ...

```