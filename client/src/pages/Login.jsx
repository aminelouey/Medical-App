import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Identifiants incorrects');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--background-color)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
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
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Connexion</h2>
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

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email professionnel"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Se connecter
                    </button>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    Pas encore de compte ?{' '}
                    <Link to="/signup" style={{
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}>
                        Inscrivez-vous
                    </Link>
                </div>
            </div>
        </div>
    );
}
