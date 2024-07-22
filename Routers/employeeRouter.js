import express from "express";
import { forgotPassword, getEmployee, loginEmployee, registerEmployee, resetPassword } from "../Controllers/employeeController.js";
import authMiddleware from "../Middleware/authMiddleware.js";


const router = express.Router()

router.post('/register-emp',registerEmployee)
router.post('/login-emp',loginEmployee)
router.get('/get-emp',authMiddleware,getEmployee)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password/:id/:token',resetPassword)

export default router;