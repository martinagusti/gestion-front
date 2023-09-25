import axios from "axios";

export const getTareas = async () => {
  const tareas = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tareas`);

  return tareas.data;
};
