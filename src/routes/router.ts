import { Response, Request, Router } from "express";
import * as apiController from "./api";
import * as userController from "./user"

const router: Router = Router();

router.get("/api", apiController.getApi);

router.get("/user", userController.createUser);

router.get("/", async (_: Request, res: Response) => {
  res.send("hello world");
});

export default router;
