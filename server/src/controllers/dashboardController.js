const { Patient, Appointment, User } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Statistiques du médecin connecté
        const patientCount = await Patient.count({
            where: { doctorId: doctorId }
        });

        const appointmentCount = await Appointment.count({
            where: { doctorId: doctorId }
        });

        // Compte uniquement ce médecin
        const doctorCount = 1;

        // Rendez-vous aujourd'hui (par statut) - du médecin connecté
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayAppointments = await Appointment.count({
            where: {
                doctorId: doctorId,
                date: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                }
            }
        });

        // Rendez-vous terminés aujourd'hui - du médecin connecté
        const todayCompleted = await Appointment.count({
            where: {
                doctorId: doctorId,
                date: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                },
                status: 'completed'
            }
        });

        // Rendez-vous annulés aujourd'hui - du médecin connecté
        const todayCancelled = await Appointment.count({
            where: {
                doctorId: doctorId,
                date: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                },
                status: 'cancelled'
            }
        });

        // Total rendez-vous terminés (tous) - du médecin connecté
        const completedTotal = await Appointment.count({
            where: {
                doctorId: doctorId,
                status: 'completed'
            }
        });

        // Total rendez-vous annulés (tous) - du médecin connecté
        const cancelledTotal = await Appointment.count({
            where: {
                doctorId: doctorId,
                status: 'cancelled'
            }
        });

        res.json({
            patients: patientCount,
            appointments: appointmentCount,
            doctors: doctorCount,
            todayAppointments: todayAppointments,
            todayCompleted: todayCompleted,
            todayCancelled: todayCancelled,
            completedTotal: completedTotal,
            cancelledTotal: cancelledTotal
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: error.message });
    }
};

// New endpoint for period statistics (week/month)
exports.getPeriodStats = async (req, res) => {
    try {
        const { period } = req.query; // 'week' or 'month'
        const doctorId = req.user.id;

        const now = new Date();
        let startDate = new Date();

        if (period === 'week') {
            // Last 7 days
            startDate.setDate(now.getDate() - 7);
        } else {
            // Last 30 days (month)
            startDate.setDate(now.getDate() - 30);
        }

        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        // Count new patients in period - for this doctor
        const newPatients = await Patient.count({
            where: {
                doctorId: doctorId,
                createdAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        });

        // Count appointments in period - for this doctor
        const periodAppointments = await Appointment.count({
            where: {
                doctorId: doctorId,
                date: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        });

        // Count completed appointments (ALL, not just in period) - for this doctor
        const completedAppointments = await Appointment.count({
            where: {
                doctorId: doctorId,
                status: 'completed'
            }
        });

        // Count cancelled appointments (ALL, not just in period) - for this doctor
        const cancelledAppointments = await Appointment.count({
            where: {
                doctorId: doctorId,
                status: 'cancelled'
            }
        });

        // Calculate trend (compare with previous period) - for this doctor
        let previousStartDate = new Date(startDate);
        if (period === 'week') {
            previousStartDate.setDate(previousStartDate.getDate() - 7);
        } else {
            previousStartDate.setDate(previousStartDate.getDate() - 30);
        }

        const previousPatients = await Patient.count({
            where: {
                doctorId: doctorId,
                createdAt: {
                    [Op.gte]: previousStartDate,
                    [Op.lt]: startDate
                }
            }
        });

        const trend = previousPatients > 0
            ? Math.round(((newPatients - previousPatients) / previousPatients) * 100)
            : (newPatients > 0 ? 100 : 0);

        res.json({
            patients: newPatients,
            appointments: periodAppointments,
            completed: completedAppointments,
            cancelled: cancelledAppointments,
            trend: trend >= 0 ? `+ ${trend}% ` : `${trend}% `
        });
    } catch (error) {
        console.error('Period stats error:', error);
        res.status(500).json({ error: error.message });
    }
};

// New endpoint for chart data (daily/weekly breakdown)
exports.getChartData = async (req, res) => {
    try {
        const { period } = req.query; // 'week' or 'month'
        const doctorId = req.user.id;

        if (period === 'week') {
            // Generate data for last 7 days
            const chartData = [];
            const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const startOfDay = new Date(date.setHours(0, 0, 0, 0));
                const endOfDay = new Date(date.setHours(23, 59, 59, 999));

                const patientsCount = await Patient.count({
                    where: {
                        doctorId: doctorId,
                        createdAt: {
                            [Op.gte]: startOfDay,
                            [Op.lte]: endOfDay
                        }
                    }
                });

                const appointmentsCount = await Appointment.count({
                    where: {
                        doctorId: doctorId,
                        date: {
                            [Op.gte]: startOfDay,
                            [Op.lte]: endOfDay
                        }
                    }
                });

                chartData.push({
                    label: days[startOfDay.getDay()],
                    patients: patientsCount,
                    appointments: appointmentsCount
                });
            }

            res.json(chartData);
        } else {
            // Generate data for last 4 weeks
            const chartData = [];

            for (let i = 3; i >= 0; i--) {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() - (i * 7));
                endDate.setHours(23, 59, 59, 999);

                const startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);

                const patientsCount = await Patient.count({
                    where: {
                        doctorId: doctorId,
                        createdAt: {
                            [Op.gte]: startDate,
                            [Op.lte]: endDate
                        }
                    }
                });

                const appointmentsCount = await Appointment.count({
                    where: {
                        doctorId: doctorId,
                        date: {
                            [Op.gte]: startDate,
                            [Op.lte]: endDate
                        }
                    }
                });

                chartData.push({
                    label: `Sem ${4 - i} `,
                    patients: patientsCount,
                    appointments: appointmentsCount
                });
            }

            res.json(chartData);
        }
    } catch (error) {
        console.error('Chart data error:', error);
        res.status(500).json({ error: error.message });
    }
};
