import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Spinner, Alert, Button } from "reactstrap";
import { useApiConstructor } from "../../apiCalls/apiConstructor";
import useEurekaServices from "../../hooks/useEurekaServices";

const StoreModal = ({ isOpen, onClose, onSelect }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userServiceUrl, setUserServiceUrl] = useState('');
  const services = useEurekaServices();
  const apiCall = useApiConstructor(userServiceUrl);
  
  const hasFetched = useRef(false);
  const isFetching = useRef(false);

  useEffect(() => {
    if (services['ORDERS-SERVICES']) {
      setUserServiceUrl(`${services['ORDERS-SERVICES']}v1`);
    }
  }, [services]);


  useEffect(() => {
    const fetchStores = async () => {
      if (!isOpen || hasFetched.current || isFetching.current) {
        return; 
      }

      isFetching.current = true;
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching stores...");
        const response = await apiCall.get('/stores');
        setStores(response.data);
        hasFetched.current = true; 
      } catch (err) {
        setError("Error fetching stores");
        console.error("Error fetching stores:", err);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchStores();
  }, [isOpen, apiCall]);


  useEffect(() => {
    if (!isOpen) {
      hasFetched.current = false; 
      setStores([]); 
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Seleccionar Tienda</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
          </div>
        ) : error ? (
          <Alert color="danger">{error}</Alert>
        ) : (
          <>
            {stores.length > 0 ? (
              <Table striped>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id}>
                      <td>{store.name}</td>
                      <td>{store.description}</td>
                      <td>
                        <Button
                          color="primary"
                          onClick={() => {
                            onSelect(store);
                            onClose();
                          }}
                        >
                          Seleccionar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No hay tiendas disponibles.</p>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>Cerrar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default StoreModal;
