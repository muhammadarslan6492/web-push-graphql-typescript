import express, { Application, Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import http from "http";
import os from "os";
import cors from "cors";

export default class ExpressServer {
  private app: Application;
  private httpServer: http.Server;

  constructor() {
    const root = path.normalize(`${__dirname}`);
    this.app = express();
    this.app.set("appPath", `${root}client`);
    this.app.use(bodyParser.json({ limit: process.env.LIMT || "1000kb" }));
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || "1000kb",
      })
    );
    this.app.use(
      bodyParser.text({ limit: process.env.REQUEST_LIMIT || "1000kb" })
    );
    this.app.use(express.static(path.join(__dirname, "./public")));
    this.app.use(
      cors({
        origin: "*",
      })
    );

    this.app.get("/", (req: Request, res: Response) => {
      res.sendFile(`${__dirname}/public/index.html`);
    });

    this.httpServer = http.createServer(this.app);
  }

  public getHttpServer(): http.Server {
    return this.httpServer;
  }

  public getApp(): Application {
    return this.app;
  }

  public listen(port: number = Number(process.env.PORT) || 3000): void {
    const welcome = (p: number) => () => {
      const msg = `Up and running in ${
        process.env.NODE_ENV || "development"
      } @: ${os.hostname()} on port: ${p}`;
      console.info(msg);
      return msg;
    };

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ message: `${req.url} path not found` });
    });

    this.httpServer.listen(port, welcome(port));
  }
}
