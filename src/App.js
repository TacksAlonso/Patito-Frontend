import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  NavLink
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/lists/OrderList";
import NotFoundPage from "./components/NotFoundPage";
import { useSelector } from "react-redux";
import { selectToken } from "./features/auth/authSlice";
import LogoutButton from "./components/LogoutButton";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import patitoLogo from "./assets/patito.ico";

const App = () => {
  const token = useSelector(selectToken);
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <Router>
      <div>
        <Navbar className="my-2" color="dark" dark expand="md">
          <NavbarBrand href="/">
            <img
              alt="logo"
              src={patitoLogo}
              style={{
                height: 40,
                width: 40,
              }}
            />
          </NavbarBrand>
          {token && (
            <>
              <NavbarToggler onClick={toggleNavbar} className="me-2" />
              <Collapse isOpen={!collapsed} navbar>
                <Nav className="ms-auto" navbar>
                  <NavItem>
                    <NavLink to="/order-form" className="nav-link">Registrar Órdenes</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/order-list" className="nav-link">Listar Órdenes</NavLink>
                  </NavItem>
                  <NavItem>
                    <LogoutButton />
                  </NavItem>
                </Nav>
              </Collapse>
            </>
          )}
        </Navbar>
        <Routes>
          <Route
            path="/login"
            element={!token ? <LoginForm /> : <Navigate to="/" replace />}
          />
          <Route
            path="/"
            element={token ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/order-form"
            element={token ? <OrderForm /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/order-list"
            element={token ? <OrderList /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
