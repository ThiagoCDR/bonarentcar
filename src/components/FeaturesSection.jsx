import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
    return (
        <section className="features-section">
            <div className="container">
                <div className="features-grid">
                    {/* Feature 1 */}
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#17181A" viewBox="0 0 16 16">
                                <path d="M11.5 1h-7a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5zM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3-3H5V3h6v6z" />
                            </svg>
                        </div>
                        <div className="feature-text">
                            <h3>Fast Retirada Digital</h3>
                            <p>Retire seu carro em até 5 minutos, sem enfrentar filas.</p>
                            <a href="#" className="feature-link">Saiba mais</a>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#17181A" viewBox="0 0 16 16">
                                <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2zm3 4V3a3 3 0 0 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A1 1 0 0 0 1.832 14.524l.976-.058c.28-.017.447-.294.39-.556l-.506-2.336A.5.5 0 0 1 3.167 11h9.666a.5.5 0 0 1 .481.576l-.506 2.337c-.057.262.11.539.39.556l.976.057A1 1 0 0 0 15.15 13.13l-1.027-6.853A1.5 1.5 0 0 0 12.64 5H11zm-4 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                            </svg>
                        </div>
                        <div className="feature-text">
                            <h3>Adicionais</h3>
                            <p>Pra que sua viagem seja ainda mais simples e prazerosa!</p>
                            <a href="#" className="feature-link">Saiba mais</a>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#17181A" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                        </div>
                        <div className="feature-text">
                            <h3>Portal do Cliente</h3>
                            <p>Tudo que você precisa, em um só lugar.</p>
                            <a href="#" className="feature-link">Saiba mais</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
