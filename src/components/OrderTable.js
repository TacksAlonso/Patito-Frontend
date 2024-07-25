import React from "react";
import { Table, Button } from "reactstrap";

const OrderTable = ({ orderList, onEdit, onDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>HAWA ID</th>
          <th>Nombre de producto</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Descuento</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orderList.map((item, index) => (
          <tr key={index}>
            <td>{item.sequence}</td>
            <td>{item.hawaId}</td>
            <td>{item.nombreProducto}</td>
            <td>{item.cantidad}</td>
            <td>{item.precioLista}</td>
            <td>{item.descuento}</td>
            <td>{item.subtotal}</td>
            <td>
              <Button onClick={() => onEdit(index)}>Edit</Button>
              <Button color="danger" onClick={() => onDelete(index)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrderTable;
