import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const types = {
        success: {
            icon: CheckCircle,
            color: '#10b981',
            bg: '#d1fae5'
        },
        error: {
            icon: XCircle,
            color: '#ef4444',
            bg: '#fee2e2'
        },
        info: {
            icon: AlertCircle,
            color: '#3b82f6',
            bg: '#dbeafe'
        }
    };

    const config = types[type] || types.success;
    const Icon = config.icon;

    return (
        <div style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            backgroundColor: 'white',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--border-radius)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '500px',
            animation: 'slideInRight 0.3s ease-out',
            borderLeft: `4px solid ${config.color}`
        }}>
            <div style={{
                backgroundColor: config.bg,
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={20} color={config.color} />
            </div>

            <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 500 }}>
                {message}
            </span>

            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
                onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
                <X size={18} />
            </button>

            <style>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
