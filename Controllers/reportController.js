import RoleHistory from "../Models/roleHistorySchema.js";
import Employee from "../Models/employeeSchema.js";
import Role from "../Models/rolesSchema.js";

export const getRolePromotionReport = async (req, res) => {
  try {
    const roleHistories = await RoleHistory.find()
      .populate("employee", "userName")
      .populate("oldRole", "role")
      .populate("newRole", "role");

    res.status(200).json({
      message: "Role Promotion Report Fetched Successfully",
      result: roleHistories,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to Fetch Role Promotion Report, Internal Server Error" });
  }
};

export const getEmployeeWorkPeriodReport = async (req, res) => {
  try {
    const employees = await Employee.find().populate('role','role').populate('department','departmentName');
    const reports = employees.map(employee => {
      return {
        userName: employee.userName,
        department: employee.department.departmentName,
        role: employee.role.role,
        dateOfJoining: employee.dateOfJoining,
        workPeriod: Math.floor((Date.now() - new Date(employee.dateOfJoining)) / (1000 * 60 * 60 * 24 * 30)), // Convert to months
      };
    });

    res.status(200).json({
      message: "Employee Work Period Report Fetched Successfully",
      result: reports,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to Fetch Work Period Report, Internal Server Error" });
  }
};
