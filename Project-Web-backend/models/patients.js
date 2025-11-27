// models/Patient.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Patient = sequelize.define("Patient", {
  patient_code: { type: DataTypes.STRING, unique: true },
  name: DataTypes.STRING,
  gender: DataTypes.STRING,
  dob: DataTypes.DATEONLY,
  email: DataTypes.STRING,
  contact_number: DataTypes.STRING,
}, { timestamps: true });

export default Patient;