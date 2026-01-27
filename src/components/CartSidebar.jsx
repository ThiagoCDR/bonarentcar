import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
    const { cartItems, removeFromCart, clearCart, isCartOpen, toggleCart } = useCart();
    const totalPrice = cartItems.reduce((acc, item) => acc + Number(item.price), 0);

    const handleCheckout = () => {
        alert("Redirecionando para pagamento...");
        clearCart();
        toggleCart();
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isCartOpen) toggleCart();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isCartOpen, toggleCart]);

    return (
        <>
            {/* Floating Action Button */}
            <button className="cart-fab" onClick={toggleCart} title="Abrir Carrinho">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16" className="cart-icon">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </button>

            {/* Sidebar Overlay (Background) */}
            <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>

            {/* Off-Canvas Sidebar */}
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Seu Carrinho</h2>
                    <button className="close-btn" onClick={toggleCart}>&times;</button>
                </div>

                <div className="cart-body">
                    {cartItems.length === 0 ? (
                        <p className="empty-msg">Seu carrinho está vazio.</p>
                    ) : (
                        <ul className="cart-items">
                            {cartItems.map(item => (
                                <li key={item.cartId} className="cart-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p className="item-type">{item.rentType === 'app' ? 'Motorista App' : 'Diária'}</p>
                                        <p className="item-price">R$ {item.price}</p>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.cartId)}>&times;</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="total">
                            <span>Total:</span>
                            <strong>R$ {totalPrice.toFixed(2)}</strong>
                        </div>
                        <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>Finalizar Reserva</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
