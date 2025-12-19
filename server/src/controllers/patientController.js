const { Patient, MedicalRecord, Appointment, User } = require('../models');

exports.getAllPatients = async (req, res) => {
    try {
        // Chaque médecin voit uniquement SES patients
        const doctorId = req.user.id;

        const patients = await Patient.findAll({
            where: { doctorId: doctorId },
            order: [['createdAt', 'DESC']]
        });

        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getPatientById = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Vérifier que le patient appartient au médecin connecté
        const patient = await Patient.findOne({
            where: {
                id: req.params.id,
                doctorId: doctorId
            },
            include: [
                { model: MedicalRecord },
                { model: Appointment }
            ]
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient non trouvé ou vous n\'avez pas accès à ce patient' });
        }

        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.createPatient = async (req, res) => {
    try {
        console.log('Creating patient with data:', req.body);
        console.log('User making request:', req.user);

        // Validation des champs requis
        const { firstName, lastName, dateOfBirth, gender } = req.body;
        if (!firstName || !lastName || !dateOfBirth || !gender) {
            return res.status(400).json({
                error: 'Les champs firstName, lastName, dateOfBirth et gender sont obligatoires'
            });
        }

        // Ajouter automatiquement le doctorId de l'utilisateur connecté
        const patientData = {
            ...req.body,
            doctorId: req.user.id
        };

        const patient = await Patient.create(patientData);
        console.log('Patient created successfully:', patient.id);
        res.status(201).json(patient);
    } catch (error) {
        console.error('Error creating patient:', error);

        // Gestion des erreurs de validation Sequelize
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Erreur de validation',
                details: error.errors.map(e => e.message)
            });
        }

        res.status(500).json({ error: error.message });
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Vérifier que le patient appartient au médecin
        const patient = await Patient.findOne({
            where: {
                id: req.params.id,
                doctorId: doctorId
            }
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient non trouvé ou vous n\'avez pas accès à ce patient' });
        }

        await patient.update(req.body);
        res.json(patient);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Vérifier que le patient appartient au médecin
        const patient = await Patient.findOne({
            where: {
                id: req.params.id,
                doctorId: doctorId
            }
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient non trouvé ou vous n\'avez pas accès à ce patient' });
        }

        await patient.destroy();
        res.json({ message: 'Patient deleted' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: error.message });
    }
};
