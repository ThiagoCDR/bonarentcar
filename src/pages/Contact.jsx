import React from 'react';
import './PageStyles.css';

const Contact = () => {
    const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
                setFormData({ name: '', email: '', message: '' });
            } else {
                alert('Erro ao enviar mensagem.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao enviar mensagem.');
        }
    };

    return (
        <div className="page-container container">
            <h1>Entre em Contato</h1>
            <div className="contact-layout">
                <div className="contact-info">
                    <h2>Fale Conosco</h2>
                    <p>Estamos prontos para atender você.</p>
                    <ul>
                        <li><strong>Telefone:</strong> 0800 123 4567</li>
                        <li><strong>Email:</strong> contato@bonarentacar.com.br</li>
                        <li><strong>Endereço:</strong> Av. das Nações, 1000 - São Paulo, SP</li>
                    </ul>
                </div>
                <div className="contact-form-section">
                    <form onSubmit={handleSubmit} className="generic-form">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Mensagem</label>
                            <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Enviar Mensagem</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
