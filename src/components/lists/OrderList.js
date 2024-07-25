import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, confirmOrder, cancelOrder } from '../../features/orders/ordersSlice';
import OrderDetail from './OrderDetail'; 
import { Table, Button } from "reactstrap";
import useEurekaServices from "../../hooks/useEurekaServices";


const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.list);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userServiceUrl, setUserServiceUrl] = useState('');
  const services = useEurekaServices();

  useEffect(() => {
    if (services['ORDERS-SERVICES']) {
      setUserServiceUrl(`${services['ORDERS-SERVICES']}v1`);
    }
  }, [services]);

  useEffect(() => {
    dispatch(fetchOrders(userServiceUrl));
  }, [dispatch, userServiceUrl]);

  const handleSelectOrder = (order) => {
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(order);
    }
  };

  const handleConfirmOrder = (orderId) => {
    dispatch(confirmOrder(orderId,userServiceUrl));
  };

  const handleCancelOrder = (orderId) => {
    dispatch(cancelOrder(orderId,userServiceUrl));
  };

  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Estado</th>
            <th>Fecha de creacion</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer.id} - {order.customer.name} {order.customer.lastname}</td>
                <td>{order.salesPersonName}</td>
                <td>{order.statusDescription}</td>
                <td>{new Date(order.createDate).toLocaleString()}</td>
                <td>
                  <Button outline color="info" onClick={() => handleSelectOrder(order)}>
                    {selectedOrder && selectedOrder.id === order.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                  </Button>{' '}
                  {order.status === 'E-P' && (
                    <>
                      <Button outline color="success" onClick={() => handleConfirmOrder(order.id)}>Entregar</Button>{' '}
                      <Button outline color="danger" onClick={() => handleCancelOrder(order.id)}>Cancelar</Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay pedidos disponibles</td>
            </tr>
          )}
        </tbody>
      </Table>
      {selectedOrder && <OrderDetail order={selectedOrder} />}
    </div>
  );
};

export default OrderList;
