import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Table, Alert } from "reactstrap";
import RegisterClientModal from "./RegisterClientModal";
import { useApiConstructor } from "../../apiCalls/apiConstructor";
import useEurekaServices from "../../hooks/useEurekaServices";


const ClientModal = ({ isOpen, onClose, onSelect }) => {
  const [name, setName] = useState("");
  const [Lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [clients, setClients] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [userServiceUrl, setUserServiceUrl] = useState('');
  const services = useEurekaServices();
  const apiCall = useApiConstructor(userServiceUrl);

  useEffect(() => {
    if (services['CUSTOMERS-SERVICES']) {
      setUserServiceUrl(`${services['CUSTOMERS-SERVICES']}v1/customers`);
    }
  }, [services]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setLastname("");
      setPhone("");
      setEmail("");
      setClients([]);
      setShowRegisterForm(false);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    try {
      const response = await apiCall.get(`/search`, {
        params: { name, Lastname, phone, email },
      });
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleRegister = () => {
    setShowRegisterForm(false);
    handleSearch(); 
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={onClose} size="lg">
        <ModalHeader toggle={onClose}>Seleccionar Cliente</ModalHeader>
        <ModalBody>
          {!showRegisterForm ? (
            <>
              <Input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="Apellidos"
                value={Lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="Telefono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2"
              />
              <Button onClick={handleSearch} className="mb-3">Buscar</Button>
              <Button onClick={() => setShowRegisterForm(true)} color="primary" className="mb-3">Registrar nuevo cliente</Button>
              
              {clients.length === 0 && (
                <Alert color="warning">
                  No hay registros.
                </Alert>
              )}
              
              <Table striped>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Telefono</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>
                        <Button
                          onClick={() => onSelect(client)}
                          color="primary"
                        >
                          Seleccionar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <RegisterClientModal
              isOpen={showRegisterForm}
              onClose={() => setShowRegisterForm(false)}
              onRegister={handleRegister}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ClientModal;
