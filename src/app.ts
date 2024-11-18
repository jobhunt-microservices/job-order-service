import { config } from '@order/config';
import { database } from '@order/database';
import { redisConnect } from '@order/redis/connection';
import { UsersServer } from '@order/server';
import express, { Express } from 'express';

class Application {
  public initialize() {
    config.cloudinaryConfig();
    database.connection();

    const app: Express = express();
    const server = new UsersServer(app);

    server.start();

    redisConnect();
  }
}

const application = new Application();
application.initialize();
