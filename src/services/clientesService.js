import axios from "axios";

export const getClientes = async () => {
  const clientes = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/clientes`
  );

  return clientes.data;
};

export const createCliente = async (
  nombre,
  razon_social,
  cif,
  direccion,
  responsable,
  telefono_1,
  telefono_2,
  email_1,
  email_2,
  sector,
  fuente,
  web,
  url_instagram,
  url_facebook,
  anotaciones_hosting,
  anotaciones_cliente
) => {
  const cliente = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/clientes/create`,
    {
      nombre,
      razon_social,
      cif,
      direccion,
      responsable,
      telefono_1,
      telefono_2,
      email_1,
      email_2,
      sector,
      fuente,
      web,
      url_instagram,
      url_facebook,
      anotaciones_hosting,
      anotaciones_cliente,
    }
  );

  return cliente.data;
};

export const deleteCliente = async (id) => {
  const deleted = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/clientes/delete/${id}`
  );

  return deleted.data;
};

export const editCliente = async (
  nombre,
  razon_social,
  cif,
  direccion,
  responsable,
  telefono_1,
  telefono_2,
  email_1,
  email_2,
  sector,
  fuente,
  web,
  url_instagram,
  url_facebook,
  anotaciones_hosting,
  anotaciones_cliente,
  idEdit
) => {
  const cliente = await axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/clientes/update/${idEdit}`,
    {
      nombre,
      razon_social,
      cif,
      direccion,
      responsable,
      telefono_1,
      telefono_2,
      email_1,
      email_2,
      sector,
      fuente,
      web,
      url_instagram,
      url_facebook,
      anotaciones_hosting,
      anotaciones_cliente,
    }
  );

  return cliente.data;
};
