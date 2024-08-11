import Employee from "../Models/employeeSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendLink } from "../Services/Nodemailer.js";
import Role from "../Models/rolesSchema.js";
import Department from "../Models/departmentSchema.js";
import RoleHistory from "../Models/roleHistorySchema.js";

dotenv.config();

export const registerEmployee = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    const hashPassword = await bcryptjs.hash(password, 10);

    const assignedRole = await Role.find({ role });
    const roleId = assignedRole[0]._id;
    const employeeRole = assignedRole[0].role;
    var newEmployee = "";
    if (employeeRole === "Admin") {
      newEmployee = new Employee({
        userName,
        email,
        password: hashPassword,
        role: roleId,
        isAdmin: true,
      });
    } else {
      newEmployee = new Employee({
        userName,
        email,
        password: hashPassword,
        role: roleId,
      });
    }

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
    res
      .status(200)
      .json({ message: "User Logged In Successfully", userDetail });
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

//Get Employee for Profile Page
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id)
      .populate("role", "role responsibilities")
      .populate("department", "departmentName");
    if (!employee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }
    res
      .status(200)
      .json({ message: "Employee Fetched Successfully", result: employee });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to Fetch Employee, Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const employee = await Employee.findOne({ email });
    const employeeId = employee._id;
    if (!employee) {
      return res.status(401).json({ message: "Employee Not Found" });
    }
    const token = jwt.sign({ _id: employeeId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    await sendLink(email, token, employeeId);
    res.status(200).json({message:"Mail Sent Successfully"})
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error Failed to Send Email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return res.status(401).json({ message: "Password does not match" });
    }
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(401).json({ message: "Employee Not Found" });
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    employee.password = hashPassword;
    await employee.save();
    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Cannot Reset Password. Internal Server Error" });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("role", "role") // Populate 'role' field with the 'role' field from Role schema
      .populate("department", "departmentName"); // Populate 'department' field with the 'departmentName' field from Department schema

    res
      .status(200)
      .json({ message: "Employees Fetched Successfully", result: employees });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Cannot Fetch Employees, Internal Server Error" });
  }
};

export const getEmployeeToAssignRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "Id is Missing" });
    }
    const employee = await Employee.findById(id).populate('role','role').populate('department','departmentName');
    if (!employee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }
    res
      .status(200)
      .json({ message: "Employee Fetched Successfully", result: employee });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .josn({ message: "Cannot Fetch Employees, Internal Server Error" });
  }
};
     
export const assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, department, userName, email } = req.body;

    // Find the Role and Department by their names
    const updatedRole = await Role.findOne({ role });
    const updatedDepartment = await Department.findOne({ departmentName: department });

    // Check if Role and Department are valid
    if (!updatedRole || !updatedDepartment) {
      return res.status(400).json({
        message: "Invalid Role or Department",
      });
    }
    

    // Find the employee and old role
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const oldRoleId = employee.role;

    // Find the old role for logging purposes
    const oldRole = await Role.findById(oldRoleId);
    if (!oldRole) {
      return res.status(404).json({
        message: "Old Role not found",
      });
    }
    //Check whether the old and current role are same
    if(updatedRole.role===oldRole.role){
      return res.status(400).json({
        message: "Old Role and Current Role are Same",
      });
    }
    // Update the employee with new role and department
    const updateEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        $set: {
          userName: userName,
          email: email,
          role: updatedRole._id,
          department: updatedDepartment._id,
        },
      },
      { new: true }
    );

    // Log role change
    const roleHistory = new RoleHistory({
      employee: updateEmployee._id,
      oldRole: oldRoleId,
      newRole: updatedRole._id,
    });
    await roleHistory.save();

    res.status(200).json({
      message: "Role and Department Assigned Successfully",
      result: updateEmployee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Cannot Assign Role or Department, Internal Server Error",
    });
  }
};


export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEmp = await Employee.findByIdAndDelete(id);
    if (!deleteEmp) {
      return res.status(404).json({ message: "Employee Not Found" });
    }
    res.status(200).json({ message: "Employee Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Cannot Delete Employee, Internal Server Error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({
        message: "Employee Updated Successfully",
        result: updatedEmployee,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to Update Employee, Internal Server Error" });
  }
};
