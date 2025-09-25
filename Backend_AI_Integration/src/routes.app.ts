import { Application } from "express";
import { authRoutes } from "@module-auth/routes/authRoutes";
import { userRoutes } from "@module-user/routes/userRoutes";
import { elasticRoutes } from "@module-elastic/routes/esRoutes";
import { mailRoutes } from "@module-mail/routes/mailRoutes";
import router_v1 from "./routes/v1";

const BASE_PATH_V1 = "/api/v1";
const BASE_PATH_V2 = "/api/v2";

export default (app: Application) => {
  const routes = () => {
    // app.use('/queues', serverAdapter.getRouter());
    // app.use('', healthRoutes.health());
    // app.use('', healthRoutes.env());
    // app.use('', healthRoutes.instance());
    // app.use('', healthRoutes.fiboRoutes());

    app.use(BASE_PATH_V1, router_v1);
    app.use(BASE_PATH_V2, authRoutes.index());
    app.use(BASE_PATH_V2, userRoutes.index());
    app.use(BASE_PATH_V2, elasticRoutes.index());
    app.use(BASE_PATH_V2,mailRoutes.index());

    // app.use(BASE_PATH, authRoutes.signoutRoute());

    // app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    // app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
    // app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
    // app.use(BASE_PATH, authMiddleware.verifyUser, commentRoutes.routes());
    // app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes());
    // app.use(BASE_PATH, authMiddleware.verifyUser, notificationRoutes.routes());
    // app.use(BASE_PATH, authMiddleware.verifyUser, imageRoutes.routes());
    // app.use(BASE_PATH, authMiddleware.verifyUser, chatRoutes.routes());
    // app.use(BASE_PATH, authMiddleware.verifyUser, userRoutes.routes());
  };
  routes();
};
