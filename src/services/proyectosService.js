import axios from "axios";

export const getProyectos = async () => {
  const proyectos = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/proyectos`
  );

  return proyectos.data;
};

export const getProyectosById = async (id) => {
  const proyectos = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/proyectos/user/${id}`
  );

  return proyectos.data;
};

export const getProyectosByIdProyecto = async (id) => {
  const proyectos = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/proyectos/proyectoId/${id}`
  );

  return proyectos.data;
};

export const createProyecto = async (
  cliente,
  nombre,
  comentarios,
  fecha_inicio,
  fecha_entrega,
  etiqueta
) => {
  const proyecto = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/proyectos/create`,
    {
      id_cliente: cliente,
      nombre: nombre,
      comentarios: comentarios,
      fecha_inicio: fecha_inicio,
      fecha_entrega: fecha_entrega,
      id_etiqueta: etiqueta,
    }
  );

  return proyecto.data;
};

export const createEmpleadoAsignado = async (id_proyecto, id_empleado) => {
  const proyecto = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/proyectos/insert`,
    {
      id_proyecto,
      id_empleado,
    }
  );

  return proyecto.data;
};

export const deleteEmpleadoAsignado = async (id_proyecto, id_empleado) => {
  const proyecto = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/proyectos/deleteempleado`,
    {
      id_proyecto,
      id_empleado,
    }
  );

  return proyecto.data;
};

export const deleteProyecto = async (id_proyecto) => {
  const proyecto = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/proyectos/delete/${id_proyecto}`
  );

  return proyecto.data;
};

export const editProyecto = async (
  nombre,
  comentarios,
  fecha_entrega,
  etiqueta,
  estado,
  id
) => {
  const proyecto = await axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/proyectos/update/${id}`,
    {
      nombre: nombre,
      comentarios: comentarios,
      fecha_entrega: fecha_entrega,
      id_etiqueta: etiqueta,
      estado: estado,
    }
  );

  return proyecto.data;
};
