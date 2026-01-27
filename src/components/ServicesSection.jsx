import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
    return (
        <section className="services-section container">
            <h2 className="section-title">Conheça nossas soluções</h2>
            <div className="services-grid">
                {/* Card 1: Aluguel Diário */}
                <div className="service-card">
                    <div className="card-image">
                        <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600" alt="Aluguel de Carros" />
                    </div>
                    <div className="card-content">
                        <h3>Aluguel Diário</h3>
                        <p>Vai viajar? Escolha o carro ideal para o seu passeio com as melhores tarifas.</p>
                        <a href="/fleet" className="btn-link">Ver Grupo de Carros</a>
                    </div>
                </div>

                {/* Card 2: Assinatura */}
                <div className="service-card">
                    <div className="card-image">
                        <img src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600" alt="Bona Assinatura" />
                        <span className="tag">Destaque</span>
                    </div>
                    <div className="card-content">
                        <h3>Bona Assinatura</h3>
                        <p>Carro zero km por assinatura. Sem entrada, sem juros e sem burocracia.</p>
                        <a href="/subscription" className="btn-link">Conhecer Planos</a>
                    </div>
                </div>

                {/* Card 3: Empresas */}
                <div className="service-card">
                    <div className="card-image">
                        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600" alt="Para Empresas" />
                    </div>
                    <div className="card-content">
                        <h3>Para Empresas</h3>
                        <p>Terceirização de frotas e gestão eficiente para o seu negócio ir mais longe.</p>
                        <a href="/business" className="btn-link">Soluções Corporativas</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
