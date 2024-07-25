import React, { useState, useEffect } from "react";
import {
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Alert
} from "reactstrap";
import "../../css/ProductModal.css";
import { useApiConstructor } from "../../apiCalls/apiConstructor";
import useEurekaServices from "../../hooks/useEurekaServices";

const ProductModal = ({ isOpen, onClose, onAddToOrder, orderItems = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [originalStock, setOriginalStock] = useState(0);
  const [userServiceUrl, setUserServiceUrl] = useState('');
  const services = useEurekaServices();
  const apiCall = useApiConstructor(userServiceUrl);


  useEffect(() => {
    if (services['INVENTORY-SERVICES']) {
      setUserServiceUrl(`${services['INVENTORY-SERVICES']}v1`);
    }
  }, [services]);

  useEffect(() => {
    setSearchTerm("");
    setProducts([]);
    setSelectedProduct(null);
    setQuantity(1);
    setDiscount(0);
    setError(null);
    setCurrentPage(0);
  }, [isOpen]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiCall.get(
          `/products/search?name=${searchTerm}&page=${currentPage}&size=3`
        );
        console.log(response)
        const updatedProducts = response.data.content.map((product) => {
          const orderItem = orderItems.find(item => item.hawaId === product.id);
          if (orderItem) {
            const newStock = product.stock - orderItem.cantidad;
            return {
              ...product,
              stock: newStock < 0 ? 0 : newStock,
              available: newStock > 0
            };
          }
          return product;
        });
        setProducts(updatedProducts);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    if (searchTerm && isOpen) {
      fetchProducts();
    }
  }, [searchTerm, currentPage, apiCall, orderItems, isOpen]);

  useEffect(() => {
    if (selectedProduct) {
      setOriginalStock(selectedProduct.stock);
      setQuantity(1);
      setDiscount(0);
      setError(null);
    }
  }, [isOpen, selectedProduct]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleAddProductToOrder = () => {
    if (selectedProduct) {
      if (quantity > originalStock) {
        setError("Cantidad excede el stock disponible.");
        return;
      }

      const orderItem = {
        hawaId: selectedProduct.id,
        nombreProducto: selectedProduct.name,
        precioLista: selectedProduct.price,
        descuento: discount,
        cantidad: quantity,
        subtotal: (selectedProduct.price - discount) * quantity,
        disponibilidad: selectedProduct.stock - quantity > 0 ? "Si" : "No",
      };
      onAddToOrder(orderItem, true);
      setSelectedProduct(null);
      setQuantity(1);
      setDiscount(0);
      setOriginalStock(0);
      onClose();
    }
  };

  const handleDiscountChange = (e) => {
    let value = Number(e.target.value);
    if (value < 0) {
      value = 0;
    } else if (value > 100) {
      value = 100;
    }
    setDiscount(value);
  };

  const handleQuantityChange = (e) => {
    let value = Number(e.target.value);
    if (value < 1) {
      value = 1;
    } else if (value > originalStock) {
      value = originalStock;
    }
    setQuantity(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} className="modal-dialog-scrollable">
      <ModalHeader toggle={onClose}>Seleccionar producto</ModalHeader>
      <ModalBody className="modal-body">
        <Input
          type="text"
          placeholder="Busqueda por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Disponibilidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.available && product.stock > 0 ? "Si" : "No"}</td>
                <td>
                  {product.available && product.stock > 0 && (
                    <Button onClick={() => handleSelectProduct(product)}>
                      Seleccionar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {selectedProduct && (
          <div>
            <h5>Producto seleccionado: {selectedProduct.name}</h5>
            <FormGroup>
              <Label for="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Cantidad"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="discount">Descuento</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                placeholder="Descuento"
                value={discount}
                onChange={handleDiscountChange}
              />
            </FormGroup>

            {error && <Alert color="danger">{error}</Alert>}
            <Button onClick={handleAddProductToOrder}>Agregar a pedido</Button>
            <br />
            <br />
          </div>
        )}
        <Pagination>
          <PaginationItem disabled={currentPage === 0}>
            <PaginationLink
              previous
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index} active={index === currentPage}>
              <PaginationLink onClick={() => handlePageChange(index)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem disabled={currentPage === totalPages - 1}>
            <PaginationLink
              next
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        </Pagination>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductModal;
