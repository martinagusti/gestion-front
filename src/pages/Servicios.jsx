import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./servicios.css";

import { AuthContext } from "../context/AuthContext";
import {
  getEmpleadosByIdServicio,
  getServicios,
  getServiciosByIdEmpleado,
} from "../services";

function Servicios({
  servicios,
  setServicios,
  nivel,
  empleados,
  etiquetas,
  setIdServicio,
  setEmpleadosAsignadosByServicio,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const [viewInsertServicio, setViewInsertServicio] = useState(null);
  const [searchByCliente, setSearchByCliente] = useState("");

  const navigateTo = useNavigate();

  console.log(servicios);

  const handeOnChangeSearchByCliente = (e) => {
    setSearchByCliente(e.target.value);
  };

  const filterClientes = async () => {
    const allServicios = await getServicios();
    const filtered = allServicios.filter((element) => {
      return element.cliente_nombre
        .toLowerCase()
        .includes(searchByCliente.toLowerCase());
    });
    if (searchByCliente !== "") {
      setServicios(filtered);
    } else {
      setServicios(allServicios);
    }
  };

  const getServiciosByIdEmpleadoFunction = async (event) => {
    if (event.target.value !== "") {
      const data = await getServiciosByIdEmpleado(event.target.value);
      console.log(data);
      setServicios(data);
    } else {
      const data = await getServicios();
      setServicios(data);
    }
  };

  const getServiciosByEstado = async (event) => {
    if (event.target.value !== "") {
      const data = await getServicios();
      setServicios(
        data.filter((element) => {
          return element.estado == event.target.value;
        })
      );
    } else {
      const data = await getServicios();
      setServicios(data);
    }
  };

  const filterEtiquetas = async (e) => {
    e.preventDefault();

    if (e.target.value == "") {
      const data = await getServicios();
      setServicios(data);
    } else {
      const data = await getServicios();
      const filtered = data.filter((element) => {
        return element.etiqueta_nombre === e.target.value;
      });

      setServicios(filtered);
    }
  };

  return (
    <div className="servicios-container">
      <div className="btn-insertar-container">
        {nivel !== "empleado" && (
          <button
            className="btn-insertar"
            onClick={() => setViewInsertServicio(true)}
          >
            NUEVO
          </button>
        )}
      </div>

      {nivel !== "empleado" && (
        <div className="filtros-proyecto">
          <form
            onSubmit={(event) => {
              console.log(event);
            }}
          >
            <label>Cliente</label>
            <input
              type="text"
              name="cliente"
              id="cliente"
              onChange={handeOnChangeSearchByCliente}
            ></input>
            <button type="button" onClick={() => filterClientes()}>
              Buscar
            </button>

            <label>Empleado</label>
            <select
              name="empleados"
              id="empleados"
              onChange={(event) => getServiciosByIdEmpleadoFunction(event)}
            >
              <option value={""}>TODOS</option>
              {empleados.map((element, index) => {
                return (
                  <option key={index} value={element.id}>
                    {element.nombre}
                  </option>
                );
              })}
            </select>

            <label>Estado</label>
            <select
              name="estado"
              id="estado"
              onChange={(event) => getServiciosByEstado(event)}
            >
              <option value={""}>TODOS</option>
              <option value={"activado"}>ACTIVADO</option>
              <option value={"desactivado"}>DESACTIVADO</option>
              <option value={"cancelado"}>CANCELADO</option>
            </select>

            <label>Etiqueta</label>
            <select
              name="etiquetas"
              id="etiquetas"
              onChange={(event) => filterEtiquetas(event)}
            >
              <option value={""}>TODAS</option>
              {etiquetas.map((element, index) => {
                return (
                  <option key={index} value={element.nombre}>
                    {element.nombre}
                  </option>
                );
              })}
            </select>
          </form>
        </div>
      )}

      <table className="content-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cliente</th>
            <th>Etiqueta</th>
            <th>Fecha Inicio</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {servicios?.map((element, index) => {
            const fechaInicio = new Date(element.fecha_inicio);

            return (
              <tr
                key={index}
                onClick={async () => {
                  setIdServicio(element.id);
                  navigateTo("/servicioDetalle");
                  setEmpleadosAsignadosByServicio(
                    await getEmpleadosByIdServicio(element.id)
                  );
                }}
              >
                <td>{element.nombre}</td>
                <td>{element.cliente_nombre}</td>
                <td>{element.etiqueta_nombre}</td>
                <th>{`${fechaInicio.getDate()}/${
                  fechaInicio.getMonth() + 1
                }/${fechaInicio.getFullYear()}`}</th>

                <td>{element.estado}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Servicios;
