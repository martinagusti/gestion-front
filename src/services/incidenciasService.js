import axios from "axios";

export const getIncidencias = async () => {
  const incidencias = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/incidencias`
  );

  return incidencias.data;
};

export const createIncidencia = async (
  id_proyecto,
  id_cliente,
  comentario,
  email,
  nombre,
  empresa,
  telefono
) => {
  const incidencia = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/incidencias/create`,
    {
      id_proyecto: id_proyecto,
      id_cliente: id_cliente,
      comentario: comentario,
      estado: "pendiente",
      email: email,
      nombre: nombre,
      empresa: empresa,
      telefono: telefono,
    }
  );

  return incidencia.data;
};
