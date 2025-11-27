// models/index.js
import sequelize from "../config/db.js";
import User from "./users.js";
import Doctor from "./doctors.js";
import Patient from "./patients.js";
import DoctorSchedule from "./doctor_schedule.js";
import Appointment from "./appointments.js";
import MedicalRecord from "./medical_records.js";

// User ↔ Patient
User.hasOne(Patient, { foreignKey: "user_id" });
Patient.belongsTo(User, { foreignKey: "user_id" });

// Doctor ↔ DoctorSchedule
Doctor.hasMany(DoctorSchedule, { foreignKey: "doctor_id" });
DoctorSchedule.belongsTo(Doctor, { foreignKey: "doctor_id" });

// Appointment ↔ Doctor/Patient/Schedule
Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id" });
Appointment.belongsTo(DoctorSchedule, { foreignKey: "schedule_id" });

// Patient ↔ MedicalRecord
Patient.hasMany(MedicalRecord, { foreignKey: "patient_id" });
MedicalRecord.belongsTo(Patient, { foreignKey: "patient_id" });

export { sequelize, User, Doctor, Patient, DoctorSchedule, Appointment, MedicalRecord };