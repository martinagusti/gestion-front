import axios from "axios";

export function login(email, password) {
  return axios.post(`${import.meta.env.VITE_BACKEND_URL}/empleados/login`, {
    email,
    password,
  });
}
