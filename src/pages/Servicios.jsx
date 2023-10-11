import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./servicios.css";

import { AuthContext } from "../context/AuthContext";
import {
  createServicio,
  getEmpleadosByIdServicio,
  getServicios,
  getServiciosByIdEmpleado,
} from "../services";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      {
        color: [],
      },
      {
        background: [],
      },
    ],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { list: "+1" }],
    ["link", "image"],
  ],
};

function Servicios({
  servicios,
  setServicios,
  nivel,
  empleados,
  etiquetas,
  clientes,
  setIdServicio,
  setEmpleadosAsignadosByServicio,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const [viewInsertServicio, setViewInsertServicio] = useState(null);
  const [searchByCliente, setSearchByCliente] = useState("");
  const [value, setValue] = useState("");

  const navigateTo = useNavigate();

  console.log(servicios);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const { nombre, cliente, etiqueta, estado, fecha_inicio, comentarios } =
      data;

    try {
      if (value == `<p></p>` || value == "" || value == "<p><br></p>") {
        setErrorText("Debe completar todos los campos");
      } else {
        const created = await createServicio(
          cliente,
          etiqueta,
          nombre,
          value,
          fecha_inicio,
          estado,
          comentarios
        );

        let etiqueta_nombre = etiquetas.filter((element) => {
          return element.id == etiqueta;
        });
        etiqueta_nombre = etiqueta_nombre[0].nombre;
        created[0].etiqueta_nombre = etiqueta_nombre;

        let cliente_nombre = clientes.filter((element) => {
          return element.id == cliente;
        });
        cliente_nombre = cliente_nombre[0].nombre;
        created[0].cliente_nombre = cliente_nombre;

        setServicios([created[0], ...servicios]);
        reset();
        setViewInsertServicio(false);
        setErrorText(null);
      }
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

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

      {viewInsertServicio && (
        <div className="empleado-create-modal-container">
          <div className="empleado-create-modal">
            <form
              className="form-container"
              method="post"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label>Nombre Servicio</label>
              <input
                type="text"
                id="nombre"
                placeholder="Nombre"
                {...register("nombre", {
                  required: true,
                })}
              />
              {errors.nombre?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <div>
                <div>
                  <label>Cliente</label>
                  <select
                    name="cliente"
                    id="cliente"
                    {...register("cliente", {
                      required: true,
                    })}
                  >
                    {clientes.map((element, index) => {
                      return (
                        <option key={index} value={element.id}>
                          {element.nombre}
                        </option>
                      );
                    })}
                  </select>

                  {errors.cliente?.type === "required" && (
                    <span>Campo requerido</span>
                  )}

                  <label>Etiqueta</label>

                  <select
                    name="etiqueta"
                    id="etiqueta"
                    {...register("etiqueta", {
                      required: true,
                    })}
                  >
                    {etiquetas.map((element, index) => {
                      return (
                        <option key={index} value={element.id}>
                          {element.nombre}
                        </option>
                      );
                    })}
                  </select>

                  {errors.etiqueta?.type === "required" && (
                    <span>Campo requerido</span>
                  )}

                  <label>Estado</label>

                  <select
                    name="estado"
                    id="estado"
                    {...register("estado", {
                      required: true,
                    })}
                  >
                    <option value="">SELECCIONAR</option>
                    <option value="activado">Activado</option>
                    <option value="desactivado">Desactivado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>

                  {errors.estado?.type === "required" && (
                    <span>Campo requerido</span>
                  )}
                </div>

                <label>Fecha Inicio</label>
                <input
                  type="date"
                  id="fecha_inicio"
                  {...register("fecha_inicio", {
                    required: true,
                  })}
                />
                {errors.fecha_inicio?.type === "required" && (
                  <span>Campo requerido</span>
                )}
              </div>

              <label>Descripcion</label>
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                className="editor-input"
                modules={modules}
                id="descripcion"
              />

              <label>Comentarios</label>
              <textarea
                id="comentarios"
                {...register("comentarios", {})}
              ></textarea>

              <div className="modal-actions">
                <button type="submit">CREAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewInsertServicio(false);
                    setErrorText(null);
                  }}
                >
                  CANCELAR
                </button>
              </div>
              {errorText && <span>{errorText}</span>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Servicios;
