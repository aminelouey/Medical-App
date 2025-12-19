import { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Search, Calendar, User } from 'lucide-react';

export default function MedicalRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            // We might need a new API endpoint for ALL records, currently we rely on patient-specific.
            // Let's assume we add getAllMedicalRecords to backend if missing, or use existing generic get if available.
            // Checking controller... controller seems to have createMedicalRecord and getMedicalHistory (by patient).
            // We need a generic getAll. For now, let's create the frontend assuming the endpoint exists or we fix backend.
            const response = await api.get('/medical-records');
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = records.filter(record =>
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.Patient && (record.Patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || record.Patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dossiers Médicaux</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: 'var(--border-radius)', width: '100%', maxWidth: '400px' }}>
                    <Search size={20} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Rechercher par diagnostic ou patient..."
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : filteredRecords.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <FileText size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <h3>Aucun dossier trouvé</h3>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredRecords.map((record) => (
                        <div key={record.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{record.diagnosis}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <User size={14} /> {record.Patient ? `${record.Patient.firstName} ${record.Patient.lastName}` : 'Patient Inconnu'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={14} /> {new Date(record.visitDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                                <strong>Prescription:</strong> {record.prescription || 'N/A'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
