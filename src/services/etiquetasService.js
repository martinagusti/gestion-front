import axios from "axios";

export const getEtiquetas = async () => {
  const etiquetas = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/etiquetas`
  );

  return etiquetas.data;
};

export const createEtiqueta = async (nombre) => {
  const etiqueta = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/etiquetas/create`,
    {
      nombre,
    }
  );

  return etiqueta.data;
};

export const deleteEtiqueta = async (id) => {
  const deleted = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/etiquetas/delete/${id}`
  );

  return deleted.data;
};
