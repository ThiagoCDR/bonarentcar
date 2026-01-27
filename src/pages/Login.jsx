import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginWithGoogle from '../components/LoginWithGoogle';
import './PageStyles.css'; // Reusing page styles for container

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const user = await login(email, password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/client');
            }
        } catch (err) {
            setError(err.message || 'Falha ao entrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container container" style={{ maxWidth: '450px' }}>
            <div style={{
                padding: '30px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Entrar</h1>

                {error && <div className="alert alert-danger" style={{
                    padding: '10px',
                    background: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: '10px', padding: '12px' }}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <LoginWithGoogle />

                <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <p>Não tem uma conta? <Link to="/signup" style={{ color: '#FC5806' }}>Crie uma agora</Link></p>
                    <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                        <small>Admin Demo: admin@bona.com / admin123</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
