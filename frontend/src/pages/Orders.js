import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext); // Pega o usuário logado do contexto

  useEffect(() => {
    if (!auth.user?.id) {
      // Não faz nada se não houver um ID de usuário
      setLoading(false);
      setError("Usuário não encontrado. Faça o login para ver seus pedidos.");
      return;
    }

    const fetchUserOrders = async () => {
      try {
        // Usa a rota para buscar pedidos por ID de usuário
        const response = await api.get(`/orders/user/${auth.user.id}`);
        setOrders(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Você ainda não fez nenhum pedido.");
        } else {
          setError("Falha ao carregar os pedidos.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [auth.user]); // Roda o efeito quando o usuário logado muda

  if (loading) {
    return <p>Carregando seus pedidos...</p>;
  }

  return (
    <div>
      <h2>Meus Pedidos</h2>
      
      {error && <p className="error">{error}</p>}
      
      {!error && orders.length === 0 && !loading && (
        <p>Você ainda não tem pedidos registrados.</p>
      )}

      <div className="item-list">
        {orders.map(order => (
          <div key={order.id} className="item-card">
            <h4>Pedido ID: {order.id}</h4>
            <p>ID do Usuário: {order.userId}</p>
            {/* Para mostrar os produtos do pedido, a API precisaria ser ajustada
              para incluir os produtos na resposta da rota /orders/user/:id.
              Por enquanto, mostramos apenas o ID do pedido.
            */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;