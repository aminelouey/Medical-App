const { Appointment, Patient, User } = require('../models');

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { doctorId: req.user.id }, // Filter by current doctor
            include: [
                { model: Patient, attributes: ['firstName', 'lastName'] },
                { model: User, as: 'doctor', attributes: ['fullName'] }
            ],
            order: [['date', 'ASC']]
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const { patientId, date, reason } = req.body;
        const appointment = await Appointment.create({
            patientId,
            doctorId: req.user.id, // Assigned to current user/doctor
            date,
            reason,
            status: 'confirmed' // Auto-confirm for now
        });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Rendez-vous non trouvé' });
        }

        appointment.status = status;
        await appointment.save();

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
