const sequelize = require('../config/database');
const User = require('./User');
const Patient = require('./Patient');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');

// Associations

// User (Doctor) has many Patients
User.hasMany(Patient, { foreignKey: 'doctorId', as: 'patients' });
Patient.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

// Appointments related to Patient and Doctor(User)
Patient.hasMany(Appointment, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

User.hasMany(Appointment, { foreignKey: 'doctorId', as: 'doctorAppointments' });
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

// Medical Records related to Patient and Doctor(User)
Patient.hasMany(MedicalRecord, { foreignKey: 'patientId', onDelete: 'CASCADE' });
MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId' });

User.hasMany(MedicalRecord, { foreignKey: 'doctorId', as: 'writtenRecords' });
MedicalRecord.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = {
    sequelize,
    User,
    Patient,
    Appointment,
    MedicalRecord
};
