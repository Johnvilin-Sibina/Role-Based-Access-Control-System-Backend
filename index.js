import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/config.js";
import employeeRouter from "./Routers/employeeRouter.js";
import departmentRouter from "./Routers/departmentRouter.js"

dotenv.config();
const app = express();

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//DB connection
connectDB();

//Default Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to RBAC System");
});

//API Routes
app.use('/api',employeeRouter)
app.use('/api/department',departmentRouter)

app.listen(process.env.port,()=>{
    console.log("App is listening on the port")
});
