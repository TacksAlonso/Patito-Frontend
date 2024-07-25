import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUsername } from "../features/auth/authSlice";
import { Form, Col, FormGroup, Input, Label, Button } from "reactstrap";
import ClientModal from "./modals/ClientModal";
import ProductModal from "./modals/ProductModal";
import OrderTable from "./OrderTable";
import StoreModal from "./modals/StoreModal";
import { useApiConstructor } from "../apiCalls/apiConstructor";
import useEurekaServices from "../hooks/useEurekaServices";
import Swal from 'sweetalert2';

const OrderForm = () => {
  const [orderList, setOrderList] = useState([]);
  const [customerData, setCustomerData] = useState({
    id: "",
    name: "",
    store: "",
  });
  const [vendorName, setVendorName] = useState("");
  const [storeId, setStoreId] = useState("");
  const [storeName, setStoreName] = useState("");
  const [status] = useState("E-P");
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const username = useSelector(selectUsername);
  const [userServiceUrl, setUserServiceUrl] = useState('');
  const services = useEurekaServices();
  const apiCall = useApiConstructor(userServiceUrl);

  useEffect(() => {
    if (services['ORDERS-SERVICES']) {
      setUserServiceUrl(`${services['ORDERS-SERVICES']}v1`);
    }
  }, [services]);

  const handleAddToOrder = (newItem, showAlert) => {
    const existingItemIndex = orderList.findIndex(
      (item) => item.hawaId === newItem.hawaId
    );

    if (existingItemIndex !== -1) {
      const existingItem = orderList[existingItemIndex];

      if (existingItem.descuento !== newItem.descuento && showAlert) {
        const confirmChange = window.confirm(
          `El producto con HAWA ID ${newItem.hawaId} ya existe en la orden con un descuento diferente (${existingItem.descuento}). ¿Deseas actualizarlo al nuevo descuento (${newItem.descuento})?`
        );

        if (!confirmChange) {
          return; 
        }
      }

      const updatedItem = {
        ...existingItem,
        cantidad: existingItem.cantidad + newItem.cantidad,
        descuento: newItem.descuento,
        subtotal:
          (existingItem.precioLista - newItem.descuento) *
          (existingItem.cantidad + newItem.cantidad),
      };

      const updatedOrderList = [...orderList];
      updatedOrderList[existingItemIndex] = updatedItem;
      setOrderList(updatedOrderList);
    } else {
      setOrderList([
        ...orderList,
        {
          ...newItem,
          sequence: orderList.length + 1, 
        },
      ]);
    }
  };

  const handleDeleteFromOrder = (index) => {
    const updatedOrderList = orderList.filter((_, i) => i !== index);
    setOrderList(
      updatedOrderList.map((item, idx) => ({ ...item, sequence: idx + 1 }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (orderList.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'No hay productos en la orden',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!customerData.id || !storeId || !vendorName) {
      Swal.fire({
        title: 'Error',
        text: 'Complete todos los campos obligatorios (cliente, tienda y proveedor).',
        icon: 'error',
        confirmButtonText: 'OK'
      });      return;
    }

    const isConfirmed = await Swal.fire({
      title: 'Confirmar orden',
      text: 'Estas seguro de que quieres generar la orden?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    });

    if (!isConfirmed.isConfirmed) {
      return;
    }
    
    const orderDetails = {
      customer: customerData.id,
      salesPersonName: vendorName,
      status: status,
      store: {
        id: storeId,
      },
      orderItems: orderList.map((item) => ({
        hawa: item.hawaId,
        quantity: item.cantidad,
        price: item.subtotal,
        discount: item.descuento,
        orderItem: item.sequence,
      })),
      audits: [
        {
          userId: username,
        },
      ],
    };

    try {
      const response = await apiCall.post("/orders", orderDetails);

      if (response.status === 201) { 
        Swal.fire({
          title: 'Success!',
          text: 'Su pedido ha sido creado con éxito.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          setOrderList([]);
          setCustomerData({ id: "", name: "", store: "" });
          setVendorName("");
          setStoreId("");
          setStoreName("");
        });
      } else {
        setSubmissionStatus("Error placing order");
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un problema al crear el pedido',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }

    } catch (err) {
      console.error("Error placing order:", err);
      setSubmissionStatus("Error placing order");
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un problema al crear el pedido',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div>
      <h2>Levantamiento de pedidos</h2>
      <br />
      <br />
      <Form onSubmit={handleSubmit}>
        <FormGroup row>
          <Label for="Customer" sm={2}>
            Cliente
          </Label>
          <Col sm={10}>
            <Input
              id="Customer"
              name="Customer"
              placeholder="Seleccionar cliente"
              type="text"
              value={customerData.name}
              readOnly
              onClick={() => setShowClientModal(true)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="Store" sm={2}>
            Tienda
          </Label>
          <Col sm={10}>
            <Input
              id="Store"
              name="Store"
              placeholder="Seleccionar tienda"
              type="text"
              value={storeName}
              readOnly
              onClick={() => setShowStoreModal(true)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="Vendor" sm={2}>
            Vendedor
          </Label>
          <Col sm={10}>
            <Input
              id="Vendor"
              name="Vendor"
              placeholder="Nombre del vendedor"
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </Col>
        </FormGroup>
        <div className="text-right">
          <Button outline color="primary" onClick={() => setShowProductModal(true)}>
            Agregar Producto
          </Button>
        </div>
      </Form>
      <br />
      <OrderTable
        orderList={orderList}
        onAdd={() => setShowProductModal(true)}
        onEdit={() => setShowProductModal(true)}
        onDelete={handleDeleteFromOrder}
      />
      <div>
        <p>{submissionStatus}</p>
      </div>
      <br />
      <Button outline color="success" block onClick={handleSubmit}>Generar pedido</Button>
      <br />
      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSelect={(client) => {
          setCustomerData({ id: client.id, name: client.name });
          setShowClientModal(false);
        }}
      />
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onAddToOrder={(product) => handleAddToOrder(product, true)}
        currentOrderList={orderList}
      />
      <StoreModal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        onSelect={(store) => {
          setStoreId(store.id);
          setStoreName(store.name); 
        }}
      />
    </div>
  );
};

export default OrderForm;
