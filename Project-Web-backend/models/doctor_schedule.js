import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DoctorSchedule = sequelize.define("DoctorSchedule", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  doctor_id: { type: DataTypes.INTEGER },
  start_time: { type: DataTypes.DATE },
  end_time: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, {
  tableName: "doctor_schedule",   // 👈 match your schema exactly
  timestamps: false,              // disable Sequelize’s auto timestamps
});

export default DoctorSchedule;