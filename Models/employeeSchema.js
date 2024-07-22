import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    token:String,
    role:String
})

const Employee = mongoose.model("Employee",employeeSchema)

export default Employee;