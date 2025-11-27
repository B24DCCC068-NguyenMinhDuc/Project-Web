// routes/appointments.js
import express from "express";
import auth from "../middleware/auth.js";
import { Appointment, Doctor, Patient, DoctorSchedule } from "../models/index.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
    const apps = await Appointment.findAll({ include: [Doctor, Patient, DoctorSchedule] });
    res.json(apps);
});

router.post("/", auth, async (req, res) => {
    const app = await Appointment.create(req.body); // requires appointment_code, patient_id, symptoms, etc.
    res.json(app);
});

router.put("/:id", auth, async (req, res) => {
    const app = await Appointment.findByPk(req.params.id);
    if (!app) return res.status(404).json({ message: "Not found" });
    await app.update(req.body); // assign doctor_id, update status, etc.
    res.json(app);
});

router.delete("/:id", auth, async (req, res) => {
    const app = await Appointment.findByPk(req.params.id);
    if (!app) return res.status(404).json({ message: "Not found" });
    await app.destroy();
    res.json({ ok: true });
});

export default router;