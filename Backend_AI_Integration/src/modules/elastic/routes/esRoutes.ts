import express, { Router } from "express";

import { SearchChatbot } from "../controller/search-chatbot";

class ElasticRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/es", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.post("/search-chatbot", SearchChatbot.prototype.read);
    return this.router;
  }
}

export const elasticRoutes: ElasticRoutes = new ElasticRoutes();
