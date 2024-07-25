import React from 'react';
import { useSelector } from "react-redux";
import { selectUsername } from "../features/auth/authSlice";


const HomePage = () => {
  const username = useSelector(selectUsername);
  return (
    <div>
      <h1>Bienvenido {username}</h1>
    </div>
  );
};

export default HomePage;
