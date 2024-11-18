import { BASE_PATH } from '@order/constants/path';
import { healthRoutes } from '@order/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
