import express from "express";
import { MedicalRecord, Patient } from "../models/index.js"; // adjust path if needed

const router = express.Router();

// ✅ Get all medical records (optionally filter by patient_id)
router.get("/", async (req, res) => {
    try {
        const { patient_id } = req.query;
        const where = patient_id ? { patient_id } : {};
        const records = await MedicalRecord.findAll({ where, include: [Patient] });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch medical records" });
    }
});

// ✅ Create a new medical record
router.post("/", async (req, res) => {
    try {
        const record = await MedicalRecord.create(req.body);
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: "Failed to create medical record" });
    }
});

// ✅ Update a medical record
router.put("/:id", async (req, res) => {
    try {
        const record = await MedicalRecord.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: "Record not found" });
        await record.update(req.body);
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: "Failed to update medical record" });
    }
});

// ✅ Delete a medical record
router.delete("/:id", async (req, res) => {
    try {
        const record = await MedicalRecord.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: "Record not found" });
        await record.destroy();
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete medical record" });
    }
});

export default router;