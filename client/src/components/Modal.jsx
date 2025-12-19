import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)'
            }}>
                {/* Modal Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{
                            width: '4px',
                            height: '24px',
                            background: 'linear-gradient(180deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                            borderRadius: '4px'
                        }}></span>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="btn-icon"
                        style={{
                            background: 'var(--background-secondary)',
                            border: '1px solid var(--border-color)',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            transition: 'all var(--transition-base)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--error-light)';
                            e.currentTarget.style.color = 'var(--error-color)';
                            e.currentTarget.style.transform = 'rotate(90deg)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.transform = 'rotate(0deg)';
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div>
                    {children}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes modalSlideIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(-20px) scale(0.96);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
