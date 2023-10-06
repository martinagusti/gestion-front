import axios from "axios";

export const getIncidencias = async () => {
  const incidencias = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/incidencias`
  );

  return incidencias.data;
};

export const getIncidenciasMensajes = async () => {
  const mensajes = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/incidencias/mensajes`
  );

  return mensajes.data;
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

export const createIncidenciaMensaje = async (
  idIncidencia,
  remitente,
  mensaje
) => {
  const mensajeEnviado = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/incidencias/mensajes/create`,
    {
      id_incidencia: idIncidencia,
      remitente,
      mensaje,
    }
  );

  return mensajeEnviado.data;
};

export const updateIncidencia = async (id, id_empleado, estado) => {
  const updated = await axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/incidencias/update/${id}`,
    {
      id_empleado,
      estado,
    }
  );

  return updated.data;
};
