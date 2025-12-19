import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { Calendar, Plus, Clock, User, MoreVertical, Filter, CheckCircle, XCircle, Pause } from 'lucide-react';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [filterType, setFilterType] = useState('all'); // 'all', 'today', 'upcoming'
    const [activeMenuId, setActiveMenuId] = useState(null);

    const [formData, setFormData] = useState({
        patientId: '',
        date: '',
        time: '',
        reason: ''
    });

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dateTime = new Date(`${formData.date}T${formData.time}`);
            await api.post('/appointments', {
                patientId: formData.patientId,
                date: dateTime.toISOString(),
                reason: formData.reason
            });
            setIsModalOpen(false);
            setFormData({ patientId: '', date: '', time: '', reason: '' });
            fetchAppointments();
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert(error.response?.data?.error || 'Erreur lors de la création du rendez-vous');
        }
    };

    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
            fetchAppointments(); // Refresh list
            setActiveMenuId(null); // Close menu
        } catch (error) {
            console.error('Error updating appointment status:', error);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const getFilteredAppointments = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        switch (filterType) {
            case 'today':
                return appointments.filter(apt => {
                    const aptDate = new Date(apt.date);
                    return aptDate >= today && aptDate < tomorrow;
                });
            case 'upcoming':
                return appointments.filter(apt => new Date(apt.date) >= now);
            default:
                return appointments;
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: { label: 'En attente', color: '#fbbf24', bg: '#fef3c7' },
            confirmed: { label: 'Confirmé', color: '#10b981', bg: '#d1fae5' },
            completed: { label: 'Terminé', color: '#3b82f6', bg: '#dbeafe' },
            cancelled: { label: 'Annulé', color: '#ef4444', bg: '#fee2e2' }
        };
        return configs[status] || configs.confirmed;
    };

    const filteredAppointments = getFilteredAppointments();

    return (
        <div>
            {/* Header with Filters */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1>Rendez-vous</h1>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} style={{ marginRight: '8px' }} />
                        Nouveau Rendez-vous
                    </button>
                </div>

                {/* Filter Buttons */}
                <div className="card" style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Filter size={20} color="var(--text-secondary)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Filtrer:</span>
                    <button
                        onClick={() => setFilterType('all')}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            background: filterType === 'all' ? 'var(--primary-color)' : '#f1f5f9',
                            color: filterType === 'all' ? 'white' : 'var(--text-secondary)'
                        }}
                    >
                        Tous ({appointments.length})
                    </button>
                    <button
                        onClick={() => setFilterType('today')}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            background: filterType === 'today' ? 'var(--primary-color)' : '#f1f5f9',
                            color: filterType === 'today' ? 'white' : 'var(--text-secondary)'
                        }}
                    >
                        <Calendar size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Aujourd'hui
                    </button>
                    <button
                        onClick={() => setFilterType('upcoming')}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            background: filterType === 'upcoming' ? 'var(--primary-color)' : '#f1f5f9',
                            color: filterType === 'upcoming' ? 'white' : 'var(--text-secondary)'
                        }}
                    >
                        <Clock size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        À venir
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : filteredAppointments.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Calendar size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <h3>Aucun rendez-vous {filterType === 'today' ? "aujourd'hui" : filterType === 'upcoming' ? 'à venir' : 'trouvé'}</h3>
                    <p>Commencez par planifier une nouvelle consultation.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredAppointments.map((apt) => {
                        const statusConfig = getStatusConfig(apt.status);
                        return (
                            <div key={apt.id} className="card" style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', position: 'relative' }}>
                                <div style={{ marginRight: '2rem', textAlign: 'center', minWidth: '80px' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        {new Date(apt.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {new Date(apt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, fontSize: '1.1rem', marginBottom: '4px' }}>
                                        {apt.Patient ? `${apt.Patient.firstName} ${apt.Patient.lastName}` : 'Patient Inconnu'}
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {apt.reason}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            backgroundColor: statusConfig.bg,
                                            color: statusConfig.color,
                                            fontSize: '0.8rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {statusConfig.label}
                                    </span>

                                    {/* 3-dot menu */}
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            onClick={() => setActiveMenuId(activeMenuId === apt.id ? null : apt.id)}
                                            className="btn"
                                            style={{
                                                padding: '0.5rem',
                                                background: 'transparent',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {activeMenuId === apt.id && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: '100%',
                                                    marginTop: '8px',
                                                    background: 'white',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '8px',
                                                    boxShadow: 'var(--shadow-md)',
                                                    minWidth: '200px',
                                                    zIndex: 10,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <button
                                                    onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: 'none',
                                                        background: 'white',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        fontSize: '0.9rem'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                                >
                                                    <CheckCircle size={18} color="#3b82f6" />
                                                    Marquer comme terminé
                                                </button>
                                                <button
                                                    onClick={() => updateAppointmentStatus(apt.id, 'pending')}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: 'none',
                                                        background: 'white',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        fontSize: '0.9rem'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                                >
                                                    <Pause size={18} color="#fbbf24" />
                                                    Mettre en attente
                                                </button>
                                                <button
                                                    onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: 'none',
                                                        background: 'white',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        fontSize: '0.9rem',
                                                        borderTop: '1px solid var(--border-color)'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                                >
                                                    <XCircle size={18} color="#ef4444" />
                                                    Annuler le rendez-vous
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Rendez-vous">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Patient</label>
                        <select name="patientId" className="input-field" required value={formData.patientId} onChange={handleInputChange}>
                            <option value="">Sélectionner un patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                            <input type="date" name="date" className="input-field" required value={formData.date} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Heure</label>
                            <input type="time" name="time" className="input-field" required value={formData.time} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Motif</label>
                        <input type="text" name="reason" className="input-field" required placeholder="Ex: Consultation générale" value={formData.reason} onChange={handleInputChange} />
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{ background: '#f1f5f9' }}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Planifier</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
