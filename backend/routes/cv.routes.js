import express from "express";
import { saveCv } from "../controllers/saveCv.js";
import { getCv } from "../controllers/getCv.js";
import { updateHasCompletedCv } from "../controllers/updateUserCvStatus.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes - only authenticated users can access CV operations
router.get("/get", authMiddleware, getCv);
router.post("/save", authMiddleware, saveCv);
router.put("/status", authMiddleware, updateHasCompletedCv);



export default router;
