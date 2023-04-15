import { Router } from "express";
import { gameInterfaceController } from "../controllers/gameInterfaceController";

// this file has already possesses the route of `/api/question`
const router = Router();

// GET: /api/question/content and we call the getQuestionFile function
router.get("/content", gameInterfaceController.getQuestionFile);

export default router;
