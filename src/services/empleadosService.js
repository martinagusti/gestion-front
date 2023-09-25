import axios from "axios";

export const createEmpleado = async (
  nombre,
  apellido,
  email,
  password,
  verifyPassword,
  nivel
) => {
  const empleado = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/empleados/register`,
    {
      nombre,
      apellido,
      email,
      password,
      verifyPassword,
      nivel,
    }
  );

  return empleado.data;
};

export const getEmpleados = async () => {
  const points = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/empleados`
  );

  return points.data;
};

export const editEmpleado = async (
  nombre,
  apellido,
  password,
  verifyPassword,
  nivel,
  id
) => {
  const empleado = await axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/empleados/update/${id}`,
    {
      nombre,
      apellido,
      password,
      verifyPassword,
      nivel,
    }
  );

  return empleado.data;
};

export const deleteEmpleado = async (id) => {
  const deleted = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/empleados/delete/${id}`
  );

  return deleted.data;
};
