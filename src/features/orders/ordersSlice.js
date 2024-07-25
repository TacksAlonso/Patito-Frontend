import { createSlice } from "@reduxjs/toolkit";
import createApiInstance from "../../apiCalls/apiHook";
import { selectToken } from "../auth/authSlice";
import Swal from "sweetalert2";

export const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {
    setOrders: (state, action) => {
      state.list = action.payload;
    },
    addOrder: (state, action) => {
      state.list.push(action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.list.findIndex(
        (order) => order.id === action.payload.id
      );
      if (index >= 0) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setOrders, addOrder, updateOrder } = ordersSlice.actions;

const addAuthToken = (config = {}, token) => {
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

const fetchOrders = (serviceUrl) => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = selectToken(state);
    const api = createApiInstance(serviceUrl);
    const config = addAuthToken({}, token);
    const response = await api.get("/orders", config);
    dispatch(setOrders(response.data));
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
};

export { fetchOrders };

export const confirmOrder =
  (orderId, serviceUrl) => async (dispatch, getState) => {
    try {
      const state = getState();
      const token = selectToken(state);
      const api = createApiInstance(serviceUrl);
      const config = addAuthToken({}, token);
      const response = await api.put(
        `/orders?id=${orderId}&state=E-E`,
        {},
        config
      );

      if (response.status === 200) {
        dispatch(updateOrder(response.data));
        dispatch(fetchOrders(serviceUrl));
        Swal.fire({
          title: "Éxito",
          text: "Pedido confirmado exitosamente.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al confirmar el pedido.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 404:
            Swal.fire({
              title: "Error",
              text: "Pedido no encontrado.",
              icon: "error",
              confirmButtonText: "OK",
            });
            break;
          default:
            Swal.fire({
              title: "Error",
              text: "Error al confirmar el pedido.",
              icon: "error",
              confirmButtonText: "OK",
            });
            break;
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al confirmar el pedido.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

export const cancelOrder =
  (orderId, serviceUrl) => async (dispatch, getState) => {
    try {
      const state = getState();
      const token = selectToken(state);
      const api = createApiInstance(serviceUrl);
      const config = addAuthToken({}, token);
      const response = await api.put(
        `/orders?id=${orderId}&state=E-C`,
        {},
        config
      );
      if (response.status === 200) {
        dispatch(updateOrder(response.data));
        dispatch(fetchOrders(serviceUrl)); 
        Swal.fire({
          title: "Éxito",
          text: "Pedido cancelado exitosamente.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al cancelar el pedido.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 404:
            Swal.fire({
              title: "Error",
              text: "Pedido no encontrado.",
              icon: "error",
              confirmButtonText: "OK",
            });
            break;
          case 409:
            Swal.fire({
              title: "Error",
              text: "Se ha expirado el tiempo limite para cancelar el pedido, por lo cual no se puede cancelar",
              icon: "error",
              confirmButtonText: "OK",
            });
            break;
          case 400:
            Swal.fire({
              title: "Error",
              text: "Ocurrio un error al regresar el stock, no se cambiara el estado del pedido",
              icon: "error",
              confirmButtonText: "OK",
            });
            break;
          default:
            Swal.fire({
              title: "Error",
              text: "Error al cancelar el pedido.",
              icon: "error",
              confirmButtonText: "OK",
            });
            break;
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al cancelar el pedido.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

export default ordersSlice.reducer;
