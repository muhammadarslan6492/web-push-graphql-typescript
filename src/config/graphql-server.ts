// graphqlServer.ts
import { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "../graphql/schema";

const createGraphQLServer = async (app: Application) => {
  //   const app = express();
  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app });
  return app;
};

export default createGraphQLServer;
