import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import './CarCard.css';

const CarCard = ({ car, showPrice = true }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();
    const { searchParams } = useData();

    // Use gallery if available, otherwise fallback to single image wrapped in array
    const images = car.gallery && car.gallery.length > 0 ? car.gallery : [car.image];
    const hasGallery = images.length > 1;

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleRent = () => {
        // Navigate to details page. Pass search params if they exist, or user will pick them there?
        // User said "Search -> Choose". So we likely have valid dates.
        navigate(`/rent/${car.id}`);
    };

    return (
        <div className="card">
            <div className="card-image">
                <img src={images[currentImageIndex]} alt={car.name} />
                <span className="category-badge">{car.category}</span>

                {hasGallery && (
                    <div className="gallery-controls">
                        <button className="gallery-btn prev" onClick={prevImage}>&#10094;</button>
                        <button className="gallery-btn next" onClick={nextImage}>&#10095;</button>
                        <div className="gallery-indicator">
                            {currentImageIndex + 1}/{images.length}
                        </div>
                    </div>
                )}
            </div>
            <div className="card-content">
                <h3>{car.name}</h3>
                <div className="specs">
                    <span>{car.specs.transmission}</span> •
                    <span> {car.specs.passengers || car.specs.passangers} Pessoas</span> •
                    <span> {car.specs.bags} Malas</span>
                </div>

                {showPrice ? (
                    <div className="price-options" style={{ marginTop: '15px' }}>
                        {/* We only show the price relevant to the search type if filtered? 
                            User said "checkbox for Normal/App (one option)". 
                            So if searching, we likely know the type.
                            But sticking to existing card logic for now, maybe highlighting?
                            Let's simplified: Show relevant or both if unknown.
                        */}
                        {(!searchParams || searchParams.type === 'normal') && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div>
                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Normal:</span>
                                    <strong style={{ fontSize: '1.2rem', color: '#333', marginLeft: '5px' }}>R$ {car.price}</strong>
                                </div>
                                {(searchParams?.type === 'normal' || !searchParams) &&
                                    <button onClick={handleRent} className="btn btn-sm btn-outline">Reservar</button>
                                }
                            </div>
                        )}

                        {car.priceApp && (!searchParams || searchParams.type === 'app') && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '0.9rem', color: '#FC5806' }}>App Driver:</span>
                                    <strong style={{ fontSize: '1.2rem', color: '#FC5806', marginLeft: '5px' }}>R$ {car.priceApp}</strong>
                                </div>
                                <button onClick={handleRent} className="btn btn-sm btn-primary">Reservar App</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ marginTop: '15px' }}>
                        <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>Veja detalhes para orçamentos e disponibilidade.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarCard;
