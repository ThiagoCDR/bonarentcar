import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/dateUtils';
import './AdminStyles.css';

const AdminDashboard = () => {
    const { fleet, rentals, addCar, deleteCar, updateCar, toggleAvailability, updateRental, deleteRental } = useData();
    const [view, setView] = useState('fleet'); // 'fleet' or 'rentals'
    const [newCar, setNewCar] = useState({
        name: '',
        category: 'Econômico',
        price: '',
        priceApp: '',
        images: [],
        specs: { transmission: 'Manual', passengers: 5, bags: '2' }
    });
    const [editingId, setEditingId] = useState(null);

    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    // Compress to JPEG at 60% quality
                    resolve(canvas.toDataURL('image/jpeg', 0.6));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images', file);
            });

            try {
                // Upload files first
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Erro ${res.status}: ${text}`);
                }

                const data = await res.json();

                // Update state with returned server paths
                setNewCar(prev => ({
                    ...prev,
                    images: [...prev.images, ...data.paths]
                }));

                alert('Imagens carregadas com sucesso!');
            } catch (error) {
                console.error("Error uploading images:", error);
                alert(`Erro ao fazer upload: ${error.message}`);
            }
        }
    };

    const handleEdit = (car) => {
        setNewCar({
            name: car.name,
            category: car.category,
            price: car.price,
            priceApp: car.priceApp || '',
            images: car.gallery || [car.image],
            specs: car.specs || { transmission: 'Manual', passengers: 5, bags: '2' }
        });
        setEditingId(car.id);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewCar({ name: '', category: 'Econômico', price: '', priceApp: '', images: [], specs: { transmission: 'Manual', passengers: 5, bags: '2' } });
        setEditingId(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const carData = {
            ...newCar,
            // Use existing images if none selected during edit (though here we bind images state directly)
            // For simplicity in this mock, we assume images are carried over or replaced.
            image: newCar.images.length > 0 ? newCar.images[0] : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600",
            gallery: newCar.images,
            specs: newCar.specs || { transmission: 'Manual', passengers: 5, bags: '2' }
        };

        if (editingId) {
            updateCar(editingId, carData);
            alert('Veículo atualizado com sucesso!');
        } else {
            addCar(carData);
            alert('Carro adicionado com sucesso!');
        }

        setNewCar({ name: '', category: 'Econômico', price: '', priceApp: '', images: [], specs: { transmission: 'Manual', passengers: 5, bags: '2' } });
        setEditingId(null);
    };

    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        const res = await fetch('/api/messages');
        const data = await res.json();
        setMessages(data);
    };

    // Fetch messages when view switches to 'messages'
    React.useEffect(() => {
        if (view === 'messages') {
            fetchMessages();
        }
    }, [view]);

    return (
        <div className="admin-container container">
            <div className="admin-header">
                <h1>Painel Administrativo</h1>
                <div className="admin-nav">
                    <button className={`btn ${view === 'fleet' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('fleet')}>Gerenciar Frota</button>
                    <button className={`btn ${view === 'rentals' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('rentals')}>Gerenciar Aluguéis</button>
                    <button className={`btn ${view === 'messages' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('messages')}>Mensagens do Site</button>
                </div>
            </div>

            {view === 'fleet' && (
                <div className="admin-section">
                    {/* ... existing fleet code ... */}
                    <div className="add-car-form">
                        <h3>{editingId ? 'Editar Veículo' : 'Adicionar Novo Veículo'}</h3>
                        <form onSubmit={handleSubmit}>
                            {/* ... existing form inputs ... */}
                            <input
                                type="text"
                                placeholder="Nome do Modelo"
                                value={newCar.name}
                                onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                                required
                            />
                            <select
                                value={newCar.category}
                                onChange={(e) => setNewCar({ ...newCar, category: e.target.value })}
                            >
                                <option value="Econômico">Econômico</option>
                                <option value="SUV">SUV</option>
                                <option value="Luxo">Luxo</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Preço/Dia (Normal) - R$"
                                value={newCar.price}
                                onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Preço/Semana (Motorista App) - R$"
                                value={newCar.priceApp || ''}
                                onChange={(e) => setNewCar({ ...newCar, priceApp: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select
                                    style={{ flex: 1 }}
                                    value={newCar.specs?.transmission || 'Manual'}
                                    onChange={(e) => setNewCar({ ...newCar, specs: { ...newCar.specs, transmission: e.target.value } })}
                                >
                                    <option value="Manual">Câmbio Manual</option>
                                    <option value="Automático">Câmbio Automático</option>
                                </select>
                                <select
                                    style={{ flex: 1 }}
                                    value={newCar.specs?.passengers || 5}
                                    onChange={(e) => setNewCar({ ...newCar, specs: { ...newCar.specs, passengers: parseInt(e.target.value) } })}
                                >
                                    <option value={4}>4 Pessoas</option>
                                    <option value={5}>5 Pessoas</option>
                                    <option value={6}>6 Pessoas</option>
                                    <option value={7}>7 Pessoas</option>
                                </select>
                                <select
                                    style={{ flex: 1 }}
                                    value={newCar.specs?.bags || 2}
                                    onChange={(e) => setNewCar({ ...newCar, specs: { ...newCar.specs, bags: e.target.value } })}
                                >
                                    <option value="1">1 Mala</option>
                                    <option value="2">2 Malas</option>
                                    <option value="1-2">1-2 Malas</option>
                                    <option value="3-5">3-5 Malas</option>
                                </select>
                            </div>
                            <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.9rem', color: '#666' }}>Fotos do Veículo (Selecione uma ou mais):</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    {...(!editingId && { required: true })}
                                />
                                {editingId && <small style={{ color: '#999' }}>Deixe vazio para manter as fotos atuais.</small>}
                            </div>
                            <div style={{ flex: '1 1 100%', display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingId ? 'Salvar Alterações' : 'Adicionar'}
                                </button>
                                {editingId && (
                                    <button type="button" className="btn btn-outline" onClick={handleCancelEdit} style={{ flex: 1 }}>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <h3>Veículos Ativos ({fleet.length})</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Modelo</th>
                                <th>Categoria</th>
                                <th>Preço/Dia</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fleet.map(car => (
                                <tr key={car.id} style={{ opacity: car.available === false ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                                    <td>{car.id}</td>
                                    <td>
                                        {car.name}
                                        {car.available === false && <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#dc3545', fontWeight: 'bold' }}>(Indisponível)</span>}
                                    </td>
                                    <td>{car.category}</td>
                                    <td>R$ {car.price}</td>
                                    <td style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => toggleAvailability(car.id)}
                                            style={{ borderColor: '#6c757d', color: '#6c757d', padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title={car.available === false ? "Tornar Disponível" : "Tornar Indisponível"}
                                        >
                                            {car.available === false ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleEdit(car)}
                                            style={{ borderColor: '#007bff', color: '#007bff', padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Editar Veículo"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteCar(car.id)}
                                            style={{ borderColor: '#dc3545', color: '#dc3545', padding: '5px 10px', display: 'flex', alignItems: 'center', justificationContent: 'center' }}
                                            title="Deletar Veículo"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'rentals' && (
                <div className="admin-section">
                    <h3>Aluguéis Recentes</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Veículo</th>
                                <th>Período</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map(rental => (
                                <tr key={rental.id}>
                                    <td>{rental.id}</td>
                                    <td>{rental.clientName || rental.userId}</td>
                                    <td>{rental.carName || rental.carId}</td>
                                    <td>{formatDate(rental.startDate)} até {formatDate(rental.endDate)}</td>
                                    <td>{rental.rentType === 'app' ? 'App' : 'Normal'}</td>
                                    <td>
                                        <select
                                            value={rental.status}
                                            onChange={(e) => updateRental(rental.id, { status: e.target.value })}
                                            style={{
                                                padding: '5px',
                                                borderRadius: '5px',
                                                border: '1px solid #ccc',
                                                backgroundColor:
                                                    rental.status === 'Pago' ? '#d4edda' :
                                                        rental.status === 'Em Processamento' ? '#fff3cd' :
                                                            rental.status === 'Pendente Pagamento' ? '#f8d7da' :
                                                                rental.status === 'Ativo' ? '#cce5ff' : '#f8f9fa'
                                            }}
                                        >
                                            <option value="Pendente Pagamento">Pendente Pagamento</option>
                                            <option value="Em Processamento">Em Processamento</option>
                                            <option value="Pago">Pago</option>
                                            <option value="Ativo">Ativo</option>
                                            <option value="Finalizado">Finalizado</option>
                                        </select>
                                    </td>
                                    <td style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => alert(`Gerando Boleto para aluguel #${rental.id}... (Simulação)`)}
                                            style={{ fontSize: '0.8rem', padding: '5px' }}
                                        >
                                            Boleto
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => alert(`Gerando Código Pix para aluguel #${rental.id}... (Simulação)`)}
                                            style={{ fontSize: '0.8rem', padding: '5px' }}
                                        >
                                            Pix
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteRental(rental.id)}
                                            style={{ borderColor: '#dc3545', color: '#dc3545', padding: '5px 10px' }}
                                            title="Deletar Aluguel"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'messages' && (
                <div className="admin-section">
                    <h3>Mensagens de Contato</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Mensagem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg.id}>
                                    <td>{msg.date}</td>
                                    <td>{msg.name}</td>
                                    <td>{msg.email}</td>
                                    <td>{msg.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
