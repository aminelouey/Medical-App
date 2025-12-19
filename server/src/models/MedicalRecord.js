const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    prescription: {
        type: DataTypes.TEXT
    },
    notes: {
        type: DataTypes.TEXT
    },
    visitDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = MedicalRecord;
