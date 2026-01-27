import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './PageStyles.css'; // Reuse common styles

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const totalPrice = cartItems.reduce((acc, item) => acc + Number(item.price), 0);

    const handleCheckout = () => {
        alert("Integração com pagamento em breve!");
        clearCart();
    };

    return (
        <div className="page-container container">
            <h1>Carrinho de Reservas</h1>

            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                    <p>Seu carrinho está vazio.</p>
                    <Link to="/fleet" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Ver Frota</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cartItems.map(item => (
                            <li key={item.cartId} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: '1px solid #eee',
                                padding: '20px 0'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <div>
                                        <h3>{item.name}</h3>
                                        <p style={{ color: '#666' }}>Tipo: {item.rentType === 'app' ? 'Motorista de App' : 'Diária Normal'}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>R$ {item.price}</p>
                                    <button
                                        onClick={() => removeFromCart(item.cartId)}
                                        style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'right' }}>
                        <h2 style={{ marginBottom: '20px' }}>Total: R$ {totalPrice.toFixed(2)}</h2>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                            <button onClick={clearCart} className="btn btn-outline" style={{ borderColor: '#666', color: '#666' }}>Limpar Carrinho</button>
                            <button onClick={handleCheckout} className="btn btn-primary">Finalizar Reserva</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
