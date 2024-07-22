import Employee from "../Models/employeeSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendLink } from "../Services/Nodemailer.js";

dotenv.config();

export const registerEmployee = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const hashPassword = await bcryptjs.hash(password, 10);
    const newEmployee = new Employee({
      userName,
      email,
      password: hashPassword,
    });
    await newEmployee.save();
    res
      .status(200)
      .json({ message: "Employee Registered Successfully", data: newEmployee });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Registration Failed Internal Server Error" });
  }
};

export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetail = await Employee.findOne({ email });
    if (!userDetail) {
      return res.status(401).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcryptjs.compare(password, userDetail.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      { _id: userDetail._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    userDetail.token = token;
    res.status(200).json({ message: "User Logged In Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login Failed Internal Server Error" });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const employee = await Employee.findById(employeeId);
    res.status(200).json({ message: "Authorized user", data: [employee] });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error Failed to Fetch Employee" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const employee = await Employee.findOne({email});
    console.log(employee)
    const employeeId = employee._id
    if (!employee) {
      return res.status(401).json({ message: "Employee Not Found" });
    }
    const token = jwt.sign({ _id: employeeId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    await sendLink(email, token, employeeId);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error Failed to Send Email" });
  }
};

export const resetPassword = async(req,res)=>{
  try {
    const {id} = req.params
    const {password,confirmPassword} = req.body
    if(password!=confirmPassword){
      return res.status(401).json({message:"Password does not match"})
    }
    const employee = await Employee.findById(id)
    if(!employee){
      return res.status(401).json({message:"Employee Not Found"})
    }
    const hashPassword = await bcryptjs.hash(password,10)
    employee.password = hashPassword
    await employee.save()
    res.status(200).json({message:"Password Reset Successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Cannot Reset Password. Internal Server Error"})
  }
}

