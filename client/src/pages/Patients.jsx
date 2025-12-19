import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Plus, User, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

export default function Patients() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'M',
        phone: '',
        address: '',
        emergencyContact: ''
    });
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, patientId: null, patientName: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('=== SUBMITTING PATIENT ===');
        console.log('Form data:', formData);

        try {
            console.log('Sending POST request to /patients...');
            const response = await api.post('/patients', formData);
            console.log('Patient created successfully:', response.data);

            setToast({ show: true, message: 'Patient créé avec succès !', type: 'success' });
            setIsModalOpen(false);
            setFormData({
                firstName: '', lastName: '', dateOfBirth: '',
                gender: 'M', phone: '', address: '', emergencyContact: ''
            });
            fetchPatients(); // Refresh list
        } catch (error) {
            console.error('=== ERROR CREATING PATIENT ===');
            console.error('Full error:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);

            let errorMessage = 'Erreur lors de la création du patient';

            if (error.response) {
                console.error('Server responded with error:', error.response.status, error.response.data);
                errorMessage = error.response.data?.error || `Erreur ${error.response.status}: ${error.response.statusText}`;
            } else if (error.request) {
                console.error('No response received:', error.request);
                errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.';
            } else {
                console.error('Request setup error:', error.message);
                errorMessage = error.message;
            }

            setToast({ show: true, message: errorMessage, type: 'error' });
        }
    };

    const handleDelete = async (patientId, patientName) => {
        setConfirmDialog({ isOpen: true, patientId, patientName });
    };

    const confirmDelete = async () => {
        const { patientId, patientName } = confirmDialog;
        setConfirmDialog({ isOpen: false, patientId: null, patientName: '' });

        try {
            console.log('Deleting patient:', patientId);
            await api.delete(`/patients/${patientId}`);
            setToast({ show: true, message: `Patient ${patientName} supprimé avec succès !`, type: 'success' });
            fetchPatients(); // Refresh list
        } catch (error) {
            console.error('Error deleting patient:', error);
            let errorMessage = 'Erreur lors de la suppression du patient';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }
            setToast({ show: true, message: errorMessage, type: 'error' });
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toString().includes(searchTerm)
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Patients</h1>
                <button className="btn btn-primary" style={{ gap: '8px' }} onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Nouveau Patient
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: 'var(--border-radius)', width: '100%', maxWidth: '400px' }}>
                    <Search size={20} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, ID..."
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : filteredPatients.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <User size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3>Aucun patient trouvé</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Commencez par ajouter un nouveau patient.</p>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Ajouter un patient</button>
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Nom</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date de naissance</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Téléphone</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500 }}>{patient.firstName} {patient.lastName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{patient.gender === 'M' ? 'Homme' : 'Femme'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{patient.dateOfBirth}</td>
                                    <td style={{ padding: '1rem' }}>{patient.phone}</td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <button
                                            onClick={() => navigate(`/patients/${patient.id}`)}
                                            style={{ color: 'var(--primary-color)', background: 'none', border: 'none', fontWeight: 500, cursor: 'pointer' }}
                                        >
                                            Voir
                                        </button>
                                        <button
                                            onClick={() => handleDelete(patient.id, `${patient.firstName} ${patient.lastName}`)}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Supprimer le patient"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Patient">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Prénom</label>
                            <input type="text" name="firstName" className="input-field" required value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nom</label>
                            <input type="text" name="lastName" className="input-field" required value={formData.lastName} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Date de naissance</label>
                            <input type="date" name="dateOfBirth" className="input-field" required value={formData.dateOfBirth} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Sexe</label>
                            <select name="gender" className="input-field" value={formData.gender} onChange={handleInputChange}>
                                <option value="M">Homme</option>
                                <option value="F">Femme</option>

                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Téléphone</label>
                        <input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Adresse</label>
                        <input type="text" name="address" className="input-field" value={formData.address} onChange={handleInputChange} />
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{ backgroundColor: '#f1f5f9', color: 'var(--text-secondary)' }}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, patientId: null, patientName: '' })}
                onConfirm={confirmDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer le patient ${confirmDialog.patientName} ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
            />

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: 'success' })}
                />
            )}
        </div>
    );
}
