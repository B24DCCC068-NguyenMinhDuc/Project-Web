// models/Appointment.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Appointment = sequelize.define("Appointment", {
  appointment_code: { type: DataTypes.STRING, unique: true },
  symptoms: DataTypes.TEXT,
  status: { type: DataTypes.STRING, defaultValue: "pending" }, // pending | in_treatment | completed | canceled
}, { timestamps: true });

export default Appointment;