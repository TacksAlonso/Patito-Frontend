import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import useEurekaServices from "../hooks/useEurekaServices";
import { useApiConstructor } from "../apiCalls/apiConstructor";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import "../css/LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userServiceUrl, setUserServiceUrl] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const services = useEurekaServices();
  const apiCall = useApiConstructor(userServiceUrl); 
  useEffect(() => {
    if (services['USERS-SERVICES']) {
      setUserServiceUrl(`${services['USERS-SERVICES']}v1/users`);
    }
  }, [services]);

  useEffect(() => {
  }, [userServiceUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userServiceUrl) {
        console.error("User service URL is not set.");
        return;
      }

      const response = await apiCall.post(
        `/authenticate?userName=${username}&password=${password}`
      );
      const token = response.data.token;
      const user = username;

      dispatch(login({ token, username: user }));
      navigate("/");
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="login-container">
      <Form onSubmit={handleSubmit}>
        <FormGroup floating>
          <Input
            id="username"
            name="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
          />
          <Label for="username">Usuario</Label>
        </FormGroup>{" "}
        <FormGroup floating>
          <Input
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <Label for="examplePassword">Password</Label>
        </FormGroup>{" "}
        <Button block color="primary">Iniciar sesión</Button>
      </Form>
    </div>
  );
};

export default LoginForm;
