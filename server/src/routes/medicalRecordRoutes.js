const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', medicalRecordController.createMedicalRecord);
router.get('/', medicalRecordController.getAllMedicalRecords); // New generic route
router.get('/patient/:patientId', medicalRecordController.getMedicalHistory);

module.exports = router;
