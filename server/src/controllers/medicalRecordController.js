const { MedicalRecord, Patient } = require('../models');

exports.createMedicalRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMedicalHistory = async (req, res) => {
    try {
        const records = await MedicalRecord.findAll({
            where: { patientId: req.params.patientId },
            order: [['visitDate', 'DESC']]
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.findAll({
            include: [{ model: Patient, attributes: ['firstName', 'lastName'] }],
            order: [['visitDate', 'DESC']]
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
