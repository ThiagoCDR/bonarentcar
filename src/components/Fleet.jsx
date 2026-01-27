import React from 'react';
import CarCard from './CarCard';
import { useData } from '../context/DataContext';
import './Fleet.css';

const Fleet = ({ showPrice = true }) => {
    const { fleet, filteredFleet } = useData();

    // Use filtered fleet if search is active (filteredFleet is not null), otherwise use full fleet
    // BUT only filter by available if using full fleet (which we already do below)
    const carsDisplay = filteredFleet || fleet;

    return (
        <section id="fleet" className="fleet-section">
            <div className="container">
                <div className="section-header">
                    <h2>Nossa Frota</h2>
                    <p>Escolha o veículo ideal para sua necessidade</p>
                </div>
                <div className="fleet-grid">
                    {carsDisplay.filter(car => car.available !== false).map(car => (
                        <CarCard key={car.id} car={car} showPrice={showPrice} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Fleet;
