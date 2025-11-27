// models/MedicalRecord.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const MedicalRecord = sequelize.define("MedicalRecord", {
    record_text: DataTypes.TEXT,
}, { timestamps: true });

export default MedicalRecord;