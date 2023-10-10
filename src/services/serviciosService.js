import axios from "axios";

export const getServicios = async () => {
  const servicios = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/servicios`
  );

  return servicios.data;
};

export const getServiciosByIdEmpleado = async (id) => {
  const proyectos = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/servicios/user/${id}`
  );

  return proyectos.data;
};

export const getEmpleadosByIdServicio = async (id) => {
  const proyectos = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/servicios/servicioId/${id}`
  );

  return proyectos.data;
};
