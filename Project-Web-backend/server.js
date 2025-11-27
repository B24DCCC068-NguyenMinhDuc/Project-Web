// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";
import authRouter from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import doctorRoutes from "./routes/doctors.js";
import scheduleRoutes from "./routes/doctor_schedule.js";
import appointmentRoutes from "./routes/appointments.js";
import recordRoutes from "./routes/medical_records.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/doctor-schedules", scheduleRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", recordRoutes);

await sequelize.sync(); // consider migrations in production
app.listen(process.env.PORT || 5000, () => console.log("API running"));