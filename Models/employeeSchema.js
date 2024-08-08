import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    userName:{
        type:String,
        unique:true
    },
    email:String,
    password:String,
    token:String,
    role:String,
    department:String,
    dateOfJoining:{
        type:Date,
        default:Date.now
    } 
})

const Employee = mongoose.model("Employee",employeeSchema)

export default Employee;