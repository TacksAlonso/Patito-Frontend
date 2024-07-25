import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormFeedback } from "reactstrap";
import { useApiConstructor } from "../../apiCalls/apiConstructor";
import useEurekaServices from "../../hooks/useEurekaServices";
import Swal from 'sweetalert2';


const RegisterClientModal = ({ isOpen, onClose, onRegister }) => {
  const [name, setName] = useState("");
  const [Lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [userServiceUrl, setUserServiceUrl] = useState('');
  const services = useEurekaServices();
  const apiCall = useApiConstructor(userServiceUrl);

  const phoneRegex = /^[0-9]{7,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (services['CUSTOMERS-SERVICES']) {
      setUserServiceUrl(`${services['CUSTOMERS-SERVICES']}v1/customers`);
    }
  }, [services]);

  const validateFields = () => {
    const errors = {};
    if (!name) errors.name = "El nombre es obligatorio.";
    if (!Lastname) errors.Lastname = "El apellido es obligatorio.";
    if (!phone) errors.phone = "El teléfono es obligatorio.";
    else if (!phoneRegex.test(phone)) errors.phone = "Número de teléfono inválido.";
    if (!email) errors.email = "El email es obligatorio.";
    else if (!emailRegex.test(email)) errors.email = "Email inválido.";
    if (!address) errors.address = "La dirección es obligatoria.";
    return errors;
  };

  const handleRegister = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      const newClient = { name, Lastname, phone, email, address };
      const response = await apiCall.post(`/`, newClient);

      if (response.status === 201) {
        Swal.fire({
          title: 'Éxito',
          text: 'Cliente registrado exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          onRegister();
          onClose();
        });
      } else {
        throw new Error('Failed to register client');
      }
    } catch (err) {
      console.error("Error registering client:", err);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al registrar el cliente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setPhone(value);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>Registrar Nuevo Cliente</ModalHeader>
      <ModalBody>
        <Input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2"
          invalid={!!errors.name} 
        />
        <FormFeedback>{errors.name}</FormFeedback> {}
        
        <Input
          type="text"
          placeholder="Apellidos"
          value={Lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="mb-2"
          invalid={!!errors.Lastname} 
        />
        <FormFeedback>{errors.Lastname}</FormFeedback> {}
        
        <Input
          type="tel"
          placeholder="Telefono"
          value={phone}
          onChange={handlePhoneChange}
          className="mb-2"
          invalid={!!errors.phone} 
        />
        <FormFeedback>{errors.phone}</FormFeedback> {}
        
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2"
          invalid={!!errors.email} 
        />
        <FormFeedback>{errors.email}</FormFeedback> {}
        
        <Input
          type="text"
          placeholder="Dirección" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mb-2"
          invalid={!!errors.address} 
        />
        <FormFeedback>{errors.address}</FormFeedback> {}
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleRegister}>Registrar</Button>
        <Button color="secondary" onClick={onClose}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default RegisterClientModal;
