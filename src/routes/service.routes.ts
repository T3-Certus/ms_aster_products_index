import { Router } from "express";
import { getGlobalProducts, getIndividualProducts } from "../controller";

const router = Router()

router.get("/globals", getGlobalProducts)

router.get("/individuals", getIndividualProducts)
router.get("/individuals/:idGlobal", getIndividualProducts)
router.get("/individuals/:idGlobal/:idIndividual", getIndividualProducts)

export default router