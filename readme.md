Setup environment

- React, Typescript

- Node.js
  Install dev dependencies
  yarn add -D @types/node typescript

  Run typescript using two ways

  1. compile ts internally to js and execute which takes more time due to process
     yarn add -D ts-node

  2. compile ts separately in one thread and execute only the js files
     a. to generate ts, add ts config using the below npm package
     npx tsconfig.json
     b. script to genreate js files - "watch" : "tsc -w"
     c. add script to execute the js files in node - node dist/index.js

  Run the code with hot reloading, nodemon
  yarn add -D nodemon
  add script dev - nodemon dist/index.js

- mikroORM/TypeORM

  1. Install the below packages
     yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg
  2. Create database
     createdb <db_name>

- GraphQL, UrlQL/Apollo
  1. add dependencies for graphql & apollo
     yarn add express apollo-server-express type-graphql graphql
     yarn add -D @types/express
- PostgresQL
- Redis
- Next.js
- TypegraphQL
