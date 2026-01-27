import React from 'react';
import './PageStyles.css';

const About = () => {
    return (
        <div className="page-container container">
            <h1>Sobre a Bona Rent a Car</h1>
            <div className="content-section">
                <p>A Bona Rent a Car nasceu com o propósito de transformar a experiência de aluguel de carros em algo simples, transparente e acessível. Com uma frota moderna e diversificada, atendemos desde o viajante a negócios até famílias em férias.</p>
                <p>Nossa missão é oferecer mobilidade com qualidade e segurança, garantindo que cada cliente tenha a melhor experiência possível ao dirigir um de nossos veículos.</p>
            </div>
            <div className="values-grid">
                <div className="value-item">
                    <h3>Confiança</h3>
                    <p>Transparência em todas as etapas da locação.</p>
                </div>
                <div className="value-item">
                    <h3>Qualidade</h3>
                    <p>Frota rigorosamente revisada e higienizada.</p>
                </div>
                <div className="value-item">
                    <h3>Agilidade</h3>
                    <p>Processos digitais para você ganhar tempo.</p>
                </div>
            </div>
        </div>
    );
};

export default About;
