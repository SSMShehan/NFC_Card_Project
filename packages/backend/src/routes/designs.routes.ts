import { Router } from "express";
import { createDesign, getDesign } from "../controllers/designs.controller";

const router = Router();

router.post("/", createDesign);
router.get("/:id", getDesign);

export default router;
