import axios from "axios";

export const getTareas = async () => {
  const tareas = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tareas`);

  return tareas.data;
};

export const getArchivos = async () => {
  const archivos = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/tareas/archivos`
  );

  return archivos.data;
};

export const createTarea = async (
  id_proyecto,
  id_empleado,
  titulo,
  descripcion,
  fecha_inicio,
  fecha_final,
  prioridad,
  estado
) => {
  const tarea = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/tareas/create`,
    {
      id_proyecto,
      id_empleado,
      titulo,
      descripcion,
      estado,
      prioridad,
      archivo: "",
      fecha_comienzo: fecha_inicio,
      fecha_final: fecha_final,
    }
  );

  return tarea.data;
};

export const deleteTarea = async (id) => {
  const tarea = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/tareas/delete/${id}`
  );

  return tarea.data;
};

export const deleteTareaArchivo = async (id) => {
  const archivo = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/tareas/archivo/delete/${id}`
  );

  return archivo.data;
};
