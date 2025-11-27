import express from "express";
import { DoctorSchedule, Doctor } from "../models/index.js"; // adjust path if needed

const router = express.Router();

// ✅ Get all schedules (with doctor info)
router.get("/", async (_req, res) => {
    try {
        const schedules = await DoctorSchedule.findAll({ include: [Doctor] });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch schedules" });
    }
});

// ✅ Create a new schedule
router.post("/", async (req, res) => {
    try {
        const schedule = await DoctorSchedule.create(req.body);
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: "Failed to create schedule" });
    }
});

// ✅ Update a schedule
router.put("/:id", async (req, res) => {
    try {
        const schedule = await DoctorSchedule.findByPk(req.params.id);
        if (!schedule) return res.status(404).json({ error: "Schedule not found" });
        await schedule.update(req.body);
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: "Failed to update schedule" });
    }
});

// ✅ Delete a schedule
router.delete("/:id", async (req, res) => {
    try {
        const schedule = await DoctorSchedule.findByPk(req.params.id);
        if (!schedule) return res.status(404).json({ error: "Schedule not found" });
        await schedule.destroy();
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete schedule" });
    }
});

export default router;