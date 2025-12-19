import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmer', cancelText = 'Annuler', variant = 'danger' }) {
    if (!isOpen) return null;

    const variantColors = {
        danger: {
            icon: '#ef4444',
            button: '#ef4444',
            buttonHover: '#dc2626'
        },
        warning: {
            icon: '#f59e0b',
            button: '#f59e0b',
            buttonHover: '#d97706'
        },
        info: {
            icon: '#3b82f6',
            button: '#3b82f6',
            buttonHover: '#2563eb'
        }
    };

    const colors = variantColors[variant] || variantColors.danger;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius)',
                padding: '2rem',
                maxWidth: '450px',
                width: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                animation: 'slideIn 0.2s ease-out'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        backgroundColor: `${colors.icon}15`,
                        padding: '0.75rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <AlertTriangle size={24} color={colors.icon} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                            {title}
                        </h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            {message}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        className="btn"
                        style={{
                            backgroundColor: '#f1f5f9',
                            color: 'var(--text-secondary)',
                            padding: '0.625rem 1.25rem',
                            border: 'none',
                            borderRadius: 'var(--border-radius)',
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn"
                        style={{
                            backgroundColor: colors.button,
                            color: 'white',
                            padding: '0.625rem 1.25rem',
                            border: 'none',
                            borderRadius: 'var(--border-radius)',
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = colors.buttonHover}
                        onMouseOut={(e) => e.target.style.backgroundColor = colors.button}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
