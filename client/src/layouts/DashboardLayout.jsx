import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, FileText, LogOut, Activity, ChevronRight } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        logout();
        setShowLogoutConfirm(false);
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
        { icon: Users, label: 'Patients', path: '/patients' },
        { icon: Calendar, label: 'Rendez-vous', path: '/appointments' },
        { icon: FileText, label: 'Dossiers', path: '/records' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
            {/* Modern Sidebar with Gradient */}
            <aside style={{
                width: '280px',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                boxShadow: 'var(--shadow-sm)'
            }}>
                {/* Logo & Brand */}
                <div style={{
                    padding: '2rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                        }}>
                            <Activity size={28} color="white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 style={{
                                fontWeight: '700',
                                fontSize: '1.5rem',
                                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '-4px'
                            }}>MediCare</h1>
                            <p style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-tertiary)',
                                fontWeight: '500'
                            }}>Medical Platform</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '12px',
                                    color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    background: isActive
                                        ? 'linear-gradient(135deg, var(--primary-light) 0%, rgba(14, 165, 233, 0.05) 100%)'
                                        : 'transparent',
                                    textDecoration: 'none',
                                    marginBottom: '0.5rem',
                                    fontWeight: isActive ? 600 : 500,
                                    transition: 'all var(--transition-base)',
                                    border: isActive ? '1px solid rgba(14, 165, 233, 0.2)' : '1px solid transparent',
                                    position: 'relative'
                                }}
                                onMouseOver={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid var(--border-color)',
                    background: 'linear-gradient(180deg, transparent 0%, rgba(14, 165, 233, 0.02) 100%)'
                }}>
                    <div style={{
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--surface-color)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: 'white',
                            fontSize: '1.125rem',
                            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
                        }}>
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: 'var(--text-primary)',
                                marginBottom: '2px'
                            }}>{user?.fullName}</p>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary-color)',
                                textTransform: 'capitalize'
                            }}>{user?.role}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="btn-icon"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '0.75rem 1rem',
                            color: 'var(--error-color)',
                            background: 'var(--error-light)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            width: '100%',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#fecaca';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--error-light)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: '280px',
                flex: 1,
                padding: '2.5rem',
                minHeight: '100vh'
            }}>
                <div className="animate-fade-in">
                    <Outlet />
                </div>
            </main>

            {/* Logout Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Confirmer la déconnexion"
                message="Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à l'application."
                confirmText="Se déconnecter"
                cancelText="Annuler"
                variant="danger"
            />
        </div>
    );
}
