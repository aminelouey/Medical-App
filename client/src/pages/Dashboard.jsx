import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, Calendar, ClipboardList, Activity, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        patients: 0,
        appointments: 0,
        doctors: 0,
        todayAppointments: 0,
        todayCompleted: 0,
        todayCancelled: 0,
        completedTotal: 0,
        cancelledTotal: 0
    });
    const [period, setPeriod] = useState('week');
    const [periodStats, setPeriodStats] = useState({
        patients: 0,
        appointments: 0,
        completed: 0,
        cancelled: 0,
        trend: '+0%'
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const fetchPeriodStats = async () => {
            try {
                const response = await api.get(`/dashboard/period-stats?period=${period}`);
                setPeriodStats(response.data);
            } catch (error) {
                console.error('Error fetching period stats:', error);
            }
        };
        fetchPeriodStats();
    }, [period]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await api.get(`/dashboard/chart-data?period=${period}`);
                setChartData(response.data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };
        fetchChartData();
    }, [period]);

    const maxValue = chartData.length > 0
        ? Math.max(...chartData.map(d => Math.max(d.patients, d.appointments)))
        : 10; // Default value when no data

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    marginBottom: '0.5rem',
                    fontSize: 'var(--font-size-3xl)',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Bonjour, {user?.fullName || 'Docteur'} 👋
                </h1>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '500'
                }}>
                    Voici un aperçu de l'activité de votre cabinet médical
                </p>
            </div>

            {/* Period Filter */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, var(--surface-color) 0%, var(--background-secondary) 100%)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div>
                    <h3 style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: '600',
                        marginBottom: '0.25rem',
                        color: 'var(--text-primary)'
                    }}>
                        Statistiques {period === 'week' ? 'de la semaine' : 'du mois'}
                    </h3>
                    <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-secondary)'
                    }}>
                        Tendance: <span style={{
                            color: 'var(--success-color)',
                            fontWeight: '600'
                        }}>{periodStats.trend}</span> par rapport à la période précédente
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    backgroundColor: 'var(--surface-color)',
                    padding: '0.375rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)'
                }}>
                    <button
                        onClick={() => setPeriod('week')}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: '600',
                            background: period === 'week'
                                ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
                                : 'transparent',
                            color: period === 'week' ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '8px',
                            transition: 'all var(--transition-base)'
                        }}
                    >
                        Semaine
                    </button>
                    <button
                        onClick={() => setPeriod('month')}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: '600',
                            background: period === 'month'
                                ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
                                : 'transparent',
                            color: period === 'month' ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '8px',
                            transition: 'all var(--transition-base)'
                        }}
                    >
                        Mois
                    </button>
                </div>
            </div>

            {/* Period Statistics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div className="card" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Users size={24} />
                        </div>
                        <div style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: '600'
                        }}>
                            {period === 'week' ? '7 jours' : '30 jours'}
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {periodStats.patients}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                        Nouveaux patients
                    </div>
                </div>

                <div className="card" style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={24} />
                        </div>
                        <TrendingUp size={20} />
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {periodStats.appointments}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                        Rendez-vous programmés
                    </div>
                </div>

                <div className="card" style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    border: 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CheckCircle size={24} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>
                                {periodStats.appointments > 0 ? Math.round((periodStats.completed / periodStats.appointments) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {periodStats.completed}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                        Consultations terminées
                    </div>
                </div>

                <div className="card" style={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                    border: 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <XCircle size={24} />
                        </div>
                        <TrendingDown size={20} />
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {periodStats.cancelled}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                        Rendez-vous annulés
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem'
                    }}>
                        Évolution {period === 'week' ? 'de la semaine' : 'du mois'}
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                        Comparaison patients et rendez-vous
                    </p>
                </div>

                {/* Chart Legend */}
                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                    justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
                        }}></div>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>Patients</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                        }}></div>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>Rendez-vous</span>
                    </div>
                </div>

                {/* Bar Chart */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: period === 'week' ? '1rem' : '1.5rem',
                    height: '300px',
                    padding: '1rem',
                    backgroundColor: 'var(--background-secondary)',
                    borderRadius: '12px',
                    position: 'relative'
                }}>
                    {chartData.map((data, index) => {
                        const patientsHeight = (data.patients / maxValue) * 100;
                        const appointmentsHeight = (data.appointments / maxValue) * 100;

                        return (
                            <div key={index} style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                minWidth: 0
                            }}>
                                {/* Bars */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.375rem',
                                    alignItems: 'flex-end',
                                    height: '250px',
                                    width: '100%',
                                    justifyContent: 'center'
                                }}>
                                    {/* Patients Bar */}
                                    <div style={{
                                        width: '40%',
                                        maxWidth: '50px',
                                        height: `${patientsHeight}%`,
                                        background: 'linear-gradient(180deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                                        borderRadius: '8px 8px 4px 4px',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                                        cursor: 'pointer'
                                    }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.4)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
                                        }}
                                        title={`${data.patients} patients`}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '-24px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: 'var(--font-size-xs)',
                                            fontWeight: '700',
                                            color: 'var(--primary-color)'
                                        }}>
                                            {data.patients}
                                        </div>
                                    </div>

                                    {/* Appointments Bar */}
                                    <div style={{
                                        width: '40%',
                                        maxWidth: '50px',
                                        height: `${appointmentsHeight}%`,
                                        background: 'linear-gradient(180deg, #f093fb 0%, #f5576c 100%)',
                                        borderRadius: '8px 8px 4px 4px',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)',
                                        cursor: 'pointer'
                                    }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(240, 147, 251, 0.4)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(240, 147, 251, 0.3)';
                                        }}
                                        title={`${data.appointments} rendez-vous`}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '-24px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: 'var(--font-size-xs)',
                                            fontWeight: '700',
                                            color: '#f5576c'
                                        }}>
                                            {data.appointments}
                                        </div>
                                    </div>
                                </div>

                                {/* Label */}
                                <div style={{
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: '600',
                                    color: 'var(--text-secondary)',
                                    textAlign: 'center'
                                }}>
                                    {data.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
