import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        type: 'normal',
        pickupDate: '',
        returnDate: ''
    });

    const handleChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Redirect to Search Results page with query params
        navigate(`/search?pickup=${searchData.pickupDate}&return=${searchData.returnDate}&type=${searchData.type}`);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1>Encontre o carro perfeito para sua viagem</h1>
                <p>Conforto, segurança e os melhores preços na Bona Rent a Car.</p>

                <form className="search-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ color: '#555', fontWeight: 'bold' }}>Tipo de Aluguel</label>
                        <div className="radio-group" style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#555' }}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="normal"
                                    checked={searchData.type === 'normal'}
                                    onChange={handleChange}
                                />
                                Diária Normal
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#555' }}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="app"
                                    checked={searchData.type === 'app'}
                                    onChange={handleChange}
                                />
                                Motorista App
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pickupDate">Data de Retirada</label>
                        <input
                            type="date"
                            name="pickupDate"
                            id="pickupDate"
                            value={searchData.pickupDate}
                            onChange={handleChange}
                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            required
                            min={today}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="returnDate">Data de Devolução</label>
                        <input
                            type="date"
                            name="returnDate"
                            id="returnDate"
                            value={searchData.returnDate}
                            onChange={handleChange}
                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            required
                            min={searchData.pickupDate || today}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary search-btn">BUSCAR DISPONIBILIDADE</button>
                </form>
            </div>
        </section>
    );
};

export default Hero;
