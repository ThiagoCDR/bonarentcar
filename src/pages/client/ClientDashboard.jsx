import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import './ClientStyles.css';
import { formatDate } from '../../utils/dateUtils';

const ClientDashboard = () => {
    const { user } = useAuth();
    const { rentals } = useData();

    // Mock filtering for current user
    const myRentals = rentals.filter(r => r.client === user?.name || r.client === 'Cliente Feliz');

    const handleGenerateBoleto = (id) => {
        alert(`Boleto gerado para o aluguel #${id}. O download iniciará em instantes.`);
    };

    return (
        <div className="client-container container">
            <div className="client-header">
                <h1>Minha Área</h1>
                <p>Bem-vindo, {user?.name}!</p>
            </div>

            <div className="client-stats">
                <div className="stat-card">
                    <h3>Aluguéis Ativos</h3>
                    <p className="stat-number">{myRentals.filter(r => r.status === 'Ativo').length}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Gasto</h3>
                    <p className="stat-number">R$ {myRentals.reduce((acc, curr) => acc + curr.price, 0)}</p>
                </div>
            </div>

            <div className="rentals-list">
                <h2>Meus Aluguéis</h2>
                {myRentals.length === 0 ? (
                    <p>Nenhum aluguel encontrado.</p>
                ) : (
                    <table className="rentals-table">
                        <thead>
                            <tr>
                                <th>Carro</th>
                                <th>Período</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myRentals.map(rental => (
                                <tr key={rental.id}>
                                    <td>{rental.carName || rental.carId}</td>
                                    <td>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</td>
                                    <td>{rental.rentType === 'app' ? 'Motorista App' : 'Diária Normal'}</td>
                                    <td>R$ {rental.price}</td>
                                    <td>
                                        <span className={`status-badge ${rental.status.toLowerCase()}`}>
                                            {rental.status}
                                        </span>
                                    </td>
                                    <td>
                                        {rental.status === 'Ativo' && (
                                            <button onClick={() => handleGenerateBoleto(rental.id)} className="btn btn-sm btn-primary">Gerar Boleto</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
