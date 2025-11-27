// Import the Express framework for creating web routes
import express from "express";
// Import custom authentication middleware to protect routes
import auth from "../middleware/auth.js";
// Import the Patient model for database operations
import { Patient } from "../models/index.js";

// Create a new Express router instance to define patient-related endpoints
const router = express.Router();

// GET route: Retrieve all patients
// 'auth' middleware ensures only authenticated users can access this
router.get("/", auth, async (req, res) => {
    // Query the database to fetch all patient records
    const patients = await Patient.findAll();
    // Send the patients array back to the client as JSON
    res.json(patients);
});

// POST route: Create a new patient
// 'auth' middleware protects this route from unauthorized access
router.post("/", auth, async (req, res) => {
    // Extract patient data from the request body and create a new database record
    const patient = await Patient.create(req.body);
    // Return the newly created patient (with generated ID) to the client
    res.json(patient);
});

// PUT route: Update an existing patient by ID
// ':id' is a URL parameter (e.g., /patients/123)
router.put("/:id", auth, async (req, res) => {
    // Fetch the patient from the database using the ID from the URL
    const patient = await Patient.findByPk(req.params.id);
    // If patient doesn't exist, return a 404 error to the client
    if (!patient) return res.status(404).json({ message: "Not found" });
    // Update the patient record with new data from the request body
    await patient.update(req.body);
    // Return the updated patient to the client
    res.json(patient);
});

// DELETE route: Remove a patient by ID
router.delete("/:id", auth, async (req, res) => {
    // Find the patient to delete by ID
    const patient = await Patient.findByPk(req.params.id);
    // If patient doesn't exist, return a 404 error
    if (!patient) return res.status(404).json({ message: "Not found" });
    // Permanently delete the patient from the database
    await patient.destroy();
    // Confirm successful deletion with a simple success response
    res.json({ ok: true });
});

// Export the router so it can be used in the main application
export default router;