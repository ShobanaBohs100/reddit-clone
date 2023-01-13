import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroORMConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import HelloResolver from "./resolvers/Hello";
import PostResolver from "./resolvers/Post";
import "reflect-metadata";
import UserResolver from "./resolvers/User";
async function main() {
  const orm = await MikroORM.init(mikroORMConfig);
  await orm.getMigrator().up();

  // start the server once migration setup
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => {
      return {
        em: orm.em,
      };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server started and running in ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
});

console.log("Hello world!!!");
