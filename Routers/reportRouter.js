import express from "express";
import {
  getRolePromotionReport,
  getEmployeeWorkPeriodReport,
} from "../Controllers/reportController.js";

const router = express.Router();

router.get("/role-promotion-report", getRolePromotionReport);
router.get("/work-period-report", getEmployeeWorkPeriodReport);

export default router;
