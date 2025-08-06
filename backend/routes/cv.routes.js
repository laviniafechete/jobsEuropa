import express from "express";
import { saveCv } from "../controllers/saveCv.js";
import { getCv } from "../controllers/getCv.js";
import { updateHasCompletedCv } from "../controllers/updateUserCvStatus.js";
import { uploadCvImage, deleteCvImage } from "../controllers/uploadCvImage.js";
import { uploadCvImage as uploadMiddleware, handleUploadError } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes - only authenticated users can access CV operations
router.get("/get", authMiddleware, getCv);
router.post("/save", authMiddleware, saveCv);
router.put("/status", authMiddleware, updateHasCompletedCv);

// CV image upload routes
router.post("/upload-image", authMiddleware, uploadMiddleware.single('image'), handleUploadError, uploadCvImage);
router.delete("/delete-image", authMiddleware, deleteCvImage);

export default router;
