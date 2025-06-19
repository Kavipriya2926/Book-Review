import express from "express";
import { getBooks, getBookById, addBook } from "../controllers/bookController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", protect, adminOnly, addBook);

export default router;
