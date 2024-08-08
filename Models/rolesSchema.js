import mongoose from 'mongoose';

const rolesSchema = new mongoose.schema({
    role:String,
    responsibilities:Array,
})