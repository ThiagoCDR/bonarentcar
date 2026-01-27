import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo.jpg';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section">
                    <div className="logo">
                        <Link to="/">
                            <img src={logo} alt="Bona Rent a Car" />
                        </Link>
                    </div>
                    <p>Pronto para qualquer destino.</p>
                </div>
                <div className="footer-section">
                    <h4>Links Rápidos</h4>
                    <ul>
                        <li><Link to="/">Início</Link></li>
                        <li><Link to="/fleet">Frota</Link></li>
                        <li><Link to="/about">Sobre</Link></li>
                        <li><Link to="/contact">Contato</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contato</h4>
                    <p>0800 123 4567</p>
                    <p>contato@bonarentacar.com.br</p>
                    <p>Av. das Nações, 1000 - São Paulo, SP</p>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p><Link to="https://craftstudio.com.br/">&copy; 2026 CraftStudio. Todos os direitos reservados.</Link></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
