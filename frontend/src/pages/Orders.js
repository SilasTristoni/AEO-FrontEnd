import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
// import './Orders.css'; // Descomente se você criou o arquivo CSS

const Orders = () => {
    const [pastOrders, setPastOrders] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [currentOrderItems, setCurrentOrderItems] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Pega o 'auth' e o novo 'loading' do contexto
    const { auth, loading: authLoading } = useContext(AuthContext);

    const fetchData = async () => {
        if (!auth.user?.id) {
            setPageLoading(false);
            return;
        }
        
        setPageLoading(true);
        try {
            const [ordersResponse, productsResponse] = await Promise.all([
                api.get(`/orders/user/${auth.user.id}`).catch(err => {
                    if (err.response && err.response.status === 404) return { data: [] };
                    throw err;
                }),
                api.get('/products')
            ]);
            setPastOrders(ordersResponse.data);
            setAllProducts(productsResponse.data);
        } catch (err) {
            setError("Falha ao carregar os dados da página.");
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        // Só busca os dados se a autenticação já terminou E o usuário existe
        if (!authLoading && auth.user) {
            fetchData();
        } else if (!authLoading) {
            // Se a autenticação terminou e não há usuário, paramos o loading
            setPageLoading(false);
        }
    }, [authLoading, auth.user]);

    // ... (O resto do seu código: handleAddToCart, handlePlaceOrder, etc. continua igual)
    const handleAddToCart = (product) => {
        if (!product) return;
        setCurrentOrderItems(prevItems => {
            const itemExists = prevItems.find(item => item.id === product.id);
            if (itemExists) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };
    const handleRemoveFromCart = (productId) => {
        setCurrentOrderItems(prevItems => prevItems.filter(item => item.id !== productId));
    };
    const handleQuantityChange = (productId, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);
        if (quantity < 1) {
            handleRemoveFromCart(productId);
            return;
        }
        setCurrentOrderItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: quantity } : item
            )
        );
    };
    const handlePlaceOrder = async () => {
        if (currentOrderItems.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        const orderPayload = {
            userId: auth.user.id,
            products: currentOrderItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
        };
        try {
            await api.post('/orders', orderPayload);
            alert("Pedido realizado com sucesso!");
            setCurrentOrderItems([]);
            fetchData();
        } catch (err) {
            setError("Ocorreu um erro ao finalizar o pedido.");
            console.error(err);
        }
    };


    // Se a autenticação inicial estiver rodando, mostre esta mensagem
    if (authLoading) {
        return <p>Carregando informações do usuário...</p>;
    }

    // Se o carregamento da página estiver rodando, mostre esta
    if (pageLoading) {
        return <p>Carregando seus pedidos...</p>;
    }

    return (
        <div className="orders-page">
            <div className="form-container new-order-section">
                <h3>Criar Novo Pedido</h3>
                <div className="add-product-form">
                    <select onChange={(e) => {
                        const selectedProduct = allProducts.find(p => p.id === parseInt(e.target.value));
                        handleAddToCart(selectedProduct);
                        e.target.value = "";
                    }} defaultValue="">
                        <option value="" disabled>Selecione um produto para adicionar...</option>
                        {allProducts.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name} - R$ {product.price}
                            </option>
                        ))}
                    </select>
                </div>

                <h4>Itens do Pedido</h4>
                <div className="cart-items">
                    {currentOrderItems.length === 0 ? (
                        <p>Nenhum item no pedido.</p>
                    ) : (
                        currentOrderItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <span>{item.name} (R$ {item.price})</span>
                                <div className='cart-item-actions'>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        min="1"
                                    />
                                    <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn">Remover</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {currentOrderItems.length > 0 && (
                     <button onClick={handlePlaceOrder} className="place-order-btn">Finalizar Pedido</button>
                )}
            </div>

            <div className="past-orders-section">
                <h2>Meus Pedidos</h2>
                {error && <p className="error">{error}</p>}
                {pastOrders.length === 0 && !pageLoading && <p>Você ainda não fez nenhum pedido.</p>}

                <div className="item-list">
                    {pastOrders.map(order => (
                        <div key={order.id} className="item-card order-card">
                            <h4>Pedido #{order.id}</h4>
                            <ul>
                                {order.products?.map(product => (
                                    <li key={product.id}>
                                        {product.OrderProduct.quantity}x {product.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;