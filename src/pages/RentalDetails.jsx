import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';
import './RentalDetails.css';

const RentalDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fleet, searchParams, addRental } = useData();
    const { user } = useAuth();

    // Find car by ID
    const car = fleet.find(c => c.id == id);

    // Get config from searchParams (read-only now)
    const startDate = searchParams?.startDate;
    const endDate = searchParams?.endDate;
    const rentType = searchParams?.type || 'normal';

    const [totalDays, setTotalDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (startDate && endDate && car) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day
            setTotalDays(days);

            const pricePerDay = rentType === 'app' ? (car.priceApp || car.price) : car.price;
            setTotalPrice(days * pricePerDay);
        }
    }, [startDate, endDate, rentType, car]);

    if (!car) return <div className="container" style={{ padding: '50px' }}>Carro não encontrado. Faça uma nova busca.</div>;
    if (!startDate || !endDate) return <div className="container" style={{ padding: '50px' }}>Selecione as datas na busca inicial.</div>;

    const handleRent = async () => {
        if (!user) {
            alert('Faça login ou cadastre-se para confirmar a reserva.');
            navigate('/login');
            return;
        }

        const rentalData = {
            carId: car.id,
            userId: user.id || 999,
            clientName: user.name || 'Cliente',
            carName: car.name,
            startDate: startDate,
            endDate: endDate,
            rentType: rentType,
            status: 'Ativo',
            price: totalPrice
        };

        await addRental(rentalData);
        alert('Reserva realizada com sucesso!');
        navigate('/client');
    };

    return (
        <div className="container rental-details-page">
            <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Confirmar Reserva</h1>

            <div className="confirmation-table-wrapper">
                <table className="confirmation-table">
                    <tbody>
                        <tr>
                            <td className="w-image">
                                <img src={car.image} alt={car.name} className="car-thumbnail" />
                            </td>
                            <td className="car-name-cell">
                                <h3>{car.name}</h3>
                                <span className="badge">{car.category}</span>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Período</strong></td>
                            <td>
                                {formatDate(startDate)} até {formatDate(endDate)}
                                <br />
                                <span className="text-muted">({totalDays} diárias)</span>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Valor Total</strong></td>
                            <td className="total-price-cell">
                                R$ {totalPrice.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="actions">
                <button className="btn btn-primary btn-lg" onClick={handleRent}>
                    CONFIRMAR RESERVA
                </button>
            </div>
        </div>
    );
};

export default RentalDetails;
