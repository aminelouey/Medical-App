import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import api from '../services/api';

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        try {
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                role: 'patient' // Default role
            });

            setSuccess('Compte créé avec succès ! Redirection...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la création du compte');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--background-color)',
            padding: '1rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(37, 99, 235, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto'
                    }}>
                        <Activity size={32} color="var(--primary-color)" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Créer un compte</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Espace de Santé Numérique</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: 'var(--error-color)',
                        padding: '0.75rem',
                        borderRadius: 'var(--border-radius)',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        background: '#d1fae5',
                        color: '#065f46',
                        padding: '0.75rem',
                        borderRadius: 'var(--border-radius)',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Nom complet"
                        className="input-field"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Nom d'utilisateur"
                        className="input-field"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email professionnel"
                        className="input-field"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe (min. 6 caractères)"
                        className="input-field"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmer le mot de passe"
                        className="input-field"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        S'inscrire
                    </button>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    Vous avez déjà un compte ?{' '}
                    <Link to="/login" style={{
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}>
                        Connectez-vous
                    </Link>
                </div>
            </div>
        </div>
    );
}
