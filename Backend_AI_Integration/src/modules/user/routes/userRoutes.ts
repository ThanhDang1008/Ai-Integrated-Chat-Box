import express, { Router } from "express";

import { GetData } from "../controller/get-data";

class UserRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/user", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.get("/info", GetData.prototype.read);
    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
