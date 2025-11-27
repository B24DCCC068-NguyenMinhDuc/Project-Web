import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
  role: { type: DataTypes.ENUM('admin', 'doctor', 'patient') },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, {
  tableName: 'users',   // 👈 force Sequelize to use your actual table
  timestamps: false,    // 👈 disable auto timestamps since you already have created_at/updated_at
});

export default User;