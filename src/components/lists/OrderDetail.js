import React from 'react';
import { Table } from 'reactstrap';

const OrderDetail = ({ order }) => {
  return (
    <div>
      <h4>Detalles del Pedido</h4>
      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hawa</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Descuento</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.hawa}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.discount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay detalles disponibles</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderDetail;
