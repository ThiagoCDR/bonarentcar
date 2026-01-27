import React from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
    const testimonials = [
        {
            id: 1,
            name: "Ricardo Silva",
            role: "Empresário",
            text: "O atendimento da Bona é impecável. Alugo carros para minha equipe comercial há 2 anos e nunca tive problemas.",
            rating: 5
        },
        {
            id: 2,
            name: "Mariana Souza",
            role: "Turista",
            text: "Adorei a facilidade de reservar pelo site. O carro estava limpíssimo e em ótimas condições. Recomendo!",
            rating: 5
        },
        {
            id: 3,
            name: "Carlos Mendes",
            role: "Motorista de App",
            text: "As condições para motoristas de aplicativo são as melhores do mercado. Manutenção rápida e preço justo.",
            rating: 4
        }
    ];

    return (
        <section className="testimonials-section">
            <div className="container">
                <h2 className="section-title">O que nossos clientes dizem</h2>
                <div className="testimonials-grid">
                    {testimonials.map(item => (
                        <div key={item.id} className="testimonial-card">
                            <div className="stars">
                                {"★".repeat(item.rating)}
                                {"☆".repeat(5 - item.rating)}
                            </div>
                            <p className="testimonial-text">"{item.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{item.name.charAt(0)}</div>
                                <div className="author-info">
                                    <strong>{item.name}</strong>
                                    <span>{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
