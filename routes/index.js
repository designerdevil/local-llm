import express from "express";
const router = express.Router();
import { renderHandler, textgenerationHandler, visionDiscussionHandler } from "../src/handlers.js";

router.get('/', renderHandler);

router.post('/textgeneration', textgenerationHandler);

router.post('/visionHandler', visionDiscussionHandler);

export default router;
