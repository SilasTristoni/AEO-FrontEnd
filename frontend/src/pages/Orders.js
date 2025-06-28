import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './Orders.css'; // Usaremos os estilos que já criamos

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = useContext(AuthContext); // Pega o contexto inteiro

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            } finally {
                setLoading(false);
            }
        };

        // **A CORREÇÃO ESTÁ AQUI**
        // Só tenta buscar os pedidos se o contexto estiver pronto E o usuário estiver autenticado.
        if (auth && auth.isAuthenticated) {
            fetchOrders();
        } else {
            // Se não estiver autenticado, apenas para de carregar.
            setLoading(false);
        }
    }, [auth]); // O useEffect agora depende do objeto 'auth' para rodar novamente se o estado de auth mudar.

    // Enquanto carrega, mostra uma mensagem.
    if (loading) {
        return <div className="loading-spinner">Carregando seus pedidos...</div>;
    }

    // Se não estiver autenticado (depois de carregar), mostra uma mensagem para logar.
    // O ProtectedRoute já deve ter redirecionado, mas isso é uma segurança extra.
    if (!auth || !auth.isAuthenticated) {
        return <p>Por favor, faça o login para ver seus pedidos.</p>;
    }

    return (
        <div className="orders-page">
            <h1>Meus Pedidos</h1>
            {orders.length === 0 ? (
                <p>Você ainda não fez nenhum pedido.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>Pedido #{order.id}</h3>
                                <p>Data: {new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div className="order-body">
                                <h4>Produtos:</h4>
                                <ul>
                                    {order.products.map(product => (
                                        <li key={product.id}>
                                            <span>{product.name}</span>
                                            {/* Acessa a quantidade através da tabela de junção */}
                                            <span>(Quantidade: {product.OrderProduct.quantity})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;