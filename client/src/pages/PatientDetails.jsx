import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import { ArrowLeft, User, Calendar, FileText, Plus, Clock } from 'lucide-react';

export default function PatientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('records');
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [recordForm, setRecordForm] = useState({ diagnosis: '', prescription: '', notes: '' });

    useEffect(() => {
        fetchPatient();
    }, [id]);

    const fetchPatient = async () => {
        try {
            const response = await api.get(`/patients/${id}`);
            setPatient(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/medical-records', {
                patientId: id,
                ...recordForm
            });
            setIsRecordModalOpen(false);
            setRecordForm({ diagnosis: '', prescription: '', notes: '' });
            fetchPatient();
        } catch (error) {
            console.error('Error creating record:', error);
            alert('Erreur lors de l\'ajout du dossier');
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (!patient) return <div>Patient introuvable</div>;

    return (
        <div>
            <button
                onClick={() => navigate('/patients')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', marginBottom: '1rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
                <ArrowLeft size={20} /> Retour
            </button>

            {/* Header */}
            <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={40} color="var(--text-secondary)" />
                </div>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>{patient.firstName} {patient.lastName}</h1>
                    <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <span>Né(e) le: {patient.dateOfBirth}</span>
                        <span>Sexe: {patient.gender}</span>
                        <span>Tel: {patient.phone}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTab('records')}
                    style={{
                        background: 'none', border: 'none',
                        color: activeTab === 'records' ? 'var(--primary-color)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'records' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        paddingBottom: '0.5rem',
                        borderBottom: activeTab === 'records' ? '2px solid var(--primary-color)' : 'none'
                    }}
                >
                    Dossier Médical
                </button>
                <button
                    onClick={() => setActiveTab('appointments')}
                    style={{
                        background: 'none', border: 'none',
                        color: activeTab === 'appointments' ? 'var(--primary-color)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'appointments' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        paddingBottom: '0.5rem',
                        borderBottom: activeTab === 'appointments' ? '2px solid var(--primary-color)' : 'none'
                    }}
                >
                    Rendez-vous
                </button>
            </div>

            {/* Content Records */}
            {activeTab === 'records' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => setIsRecordModalOpen(true)}>
                            <Plus size={18} style={{ marginRight: '8px' }} />
                            Nouvelle Consultation
                        </button>
                    </div>

                    {patient.MedicalRecords && patient.MedicalRecords.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {patient.MedicalRecords.map(record => (
                                <div key={record.id} className="card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{record.diagnosis}</h3>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={16} /> {new Date(record.visitDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <div>
                                            <strong style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Prescription</strong>
                                            <p style={{ marginTop: '0.25rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>{record.prescription || 'Aucune'}</p>
                                        </div>
                                        <div>
                                            <strong style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Notes</strong>
                                            <p style={{ marginTop: '0.25rem' }}>{record.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <FileText size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                            <p>Aucun dossier médical enregistré.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Content Appointments */}
            {activeTab === 'appointments' && (
                <div>
                    {patient.Appointments && patient.Appointments.length > 0 ? (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {patient.Appointments.map(appt => (
                                <div key={appt.id} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                                {new Date(appt.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                {new Date(appt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{appt.reason}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status: {appt.status || 'Confirmé'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <Calendar size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                            <p>Aucun rendez-vous prévu pour ce patient.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Record Modal */}
            <Modal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} title="Nouvelle Consultation">
                <form onSubmit={handleRecordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Diagnostic</label>
                        <input
                            className="input-field"
                            value={recordForm.diagnosis}
                            onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Prescription</label>
                        <textarea
                            className="input-field"
                            style={{ minHeight: '80px' }}
                            value={recordForm.prescription}
                            onChange={(e) => setRecordForm({ ...recordForm, prescription: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Notes / Observations</label>
                        <textarea
                            className="input-field"
                            style={{ minHeight: '100px' }}
                            value={recordForm.notes}
                            onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => setIsRecordModalOpen(false)} className="btn" style={{ background: '#f1f5f9' }}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
