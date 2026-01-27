import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const getDashboardLink = () => {
        return user.role === 'admin' ? '/admin' : '/client';
    };

    return (
        <header className="header">
            <div className="container header-container">
                <div className="logo">
                    <Link to="/" onClick={closeMenu}>
                        <img src={logo} alt="Bona Rent a Car" />
                    </Link>
                </div>

                <div className="mobile-menu-btn" onClick={toggleMenu}>
                    <div className={`bar ${isMenuOpen ? 'change' : ''}`}></div>
                    <div className={`bar ${isMenuOpen ? 'change' : ''}`}></div>
                    <div className={`bar ${isMenuOpen ? 'change' : ''}`}></div>
                </div>

                <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><Link to="/" className='list-nav-link' onClick={closeMenu}>Início</Link></li>
                        <li><Link to="/fleet" className='list-nav-link' onClick={closeMenu}>Frota</Link></li>
                        <li><Link to="/about" className='list-nav-link' onClick={closeMenu}>Sobre</Link></li>
                        <li><Link to="/contact" className='list-nav-link' onClick={closeMenu}>Contato</Link></li>

                        {user ? (
                            <>
                                <li><Link to={getDashboardLink()} className="dashboard-link" onClick={closeMenu}>Painel</Link></li>
                                <li><button onClick={handleLogout} className="btn btn-outline-light">Sair</button></li>
                            </>
                        ) : (
                            <li><Link to="/login" className="btn btn-primary" onClick={closeMenu}>Login</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
