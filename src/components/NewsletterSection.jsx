import React, { useState } from 'react';
import './NewsletterSection.css';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Obrigado! O email ${email} foi cadastrado com sucesso.`);
        setEmail('');
    };

    return (
        <section className="newsletter-section">
            <div className="container newsletter-content">
                <div className="newsletter-text">
                    <h2>Fique por dentro das ofertas</h2>
                    <p>Receba descontos exclusivos e novidades da Bona no seu e-mail.</p>
                </div>
                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Digite seu melhor e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary">CADASTRAR</button>
                </form>
            </div>
        </section>
    );
};

export default NewsletterSection;
