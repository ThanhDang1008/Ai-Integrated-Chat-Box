import { SignIn } from "../controller/signin";
import { GetDataUser } from "../controller/get-data-user";
import { SignOut } from "../controller/signout";
import { Register } from "../controller/register";
import express, { Router } from "express";

class AuthRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/auth", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.post("/login", SignIn.prototype.read);
    this.router.get("/account", GetDataUser.prototype.read);
    this.router.get("/signout", SignOut.prototype.update);
    this.router.post("/register", Register.prototype.create);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
