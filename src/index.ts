import ExpressServer from "./config/app";
import Socket from "./config/socket-io";
import graphqlServer from "./config/graphql-server";
import tyeormServer from "./db/typeorm";

const appServer = new ExpressServer();
const httpServer = appServer.getHttpServer();
const sockerServer = new Socket(httpServer);
const app = appServer.getApp();

const main = async () => {
  await tyeormServer.initialize();
  await graphqlServer(app);
  appServer.listen(5000);
};

main();

export default sockerServer;
