import express from "express";
import {
  assignRole,
  deleteEmployee,
  forgotPassword,
  getAllEmployees,
  getEmployee,
  getEmployeeById,
  getEmployeeToAssignRole,
  loginEmployee,
  registerEmployee,
  resetPassword,
  updateEmployee,
} from "../Controllers/employeeController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register-emp", registerEmployee);
router.post("/login-emp", loginEmployee);
router.get("/get-emp", authMiddleware, getEmployee);
router.get("/get-employee-by-id/:id", getEmployeeById);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.get("/get-all-emp", getAllEmployees);
router.get("/employee-assign-role/:id", getEmployeeToAssignRole);
router.put("/assign-role/:id", assignRole);
router.delete("/delete-employee/:id", deleteEmployee);
router.put("/update-employee/:id", updateEmployee);

export default router;
