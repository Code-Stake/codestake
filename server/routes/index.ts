import { Router } from "express";
import questionRoutes from "./questionRoutes";

const router = Router();

router.use("/question", questionRoutes);

export default router;
