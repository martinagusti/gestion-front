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

export const createServicio = async (
  cliente,
  etiqueta,
  nombre,
  value,
  fecha_inicio,
  estado,
  comentarios
) => {
  const servicio = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/servicios/create`,
    {
      id_cliente: cliente,
      id_etiqueta: etiqueta,
      nombre: nombre,
      descripcion: value,
      fecha_inicio: fecha_inicio,
      estado: estado,
      comentarios: comentarios,
    }
  );

  return servicio.data;
};

export const deleteServicio = async (idServicio) => {
  const servicio = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/servicios/delete/${idServicio}`
  );

  return servicio.data;
};

export const editServicio = async (
  cliente,
  etiqueta,
  nombre,
  value,
  fecha_inicio,
  estado,
  comentarios,
  idServicio
) => {
  const servicio = await axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/servicios/update/${idServicio}`,
    {
      id_cliente: cliente,
      id_etiqueta: etiqueta,
      nombre: nombre,
      descripcion: value,
      fecha_inicio: fecha_inicio,
      estado: estado,
      comentarios: comentarios,
    }
  );

  return servicio.data;
};

export const getServiciosArchivos = async () => {
  const archivos = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/servicios/archivos`
  );

  return archivos.data;
};

export const deleteServicioArchivo = async (id) => {
  const archivo = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/servicios/archivo/delete/${id}`
  );

  return archivo.data;
};
