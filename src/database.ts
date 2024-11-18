import { config } from '@order/config';
import { SERVICE_NAME } from '@order/constants';
import { logger } from '@order/utils/logger.util';
import { getErrorMessage } from '@jobhunt-microservices/jobhunt-shared';
import mongoose from 'mongoose';

const log = logger('orderDatabaseServer', 'debug');

export class Database {
  async connection() {
    try {
      await mongoose.connect(`${config.DATABASE_URL}`);
      log.info(SERVICE_NAME + ' Mongodb database connection has been established successfully');
    } catch (error) {
      log.error(SERVICE_NAME + ' unable to connect to db');
      log.log('error', SERVICE_NAME + ` connection() method:`, getErrorMessage(error));
    }
  }
}

export const database = new Database();
