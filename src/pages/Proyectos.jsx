import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./proyectos.css";

import { AuthContext } from "../context/AuthContext";
import {
  createProyecto,
  getEtiquetas,
  getProyectos,
  getProyectosById,
  getProyectosByIdProyecto,
} from "../services";
import { getClientes } from "../services/clientesService";

function Proyectos({
  proyectos,
  setProyectos,
  nivel,
  idProyecto,
  setIdProyecto,
  clientes,
  etiquetas,
  setEmpleadosAsignados,
  empleados,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();
  const [viewInsertProyecto, setViewInsertProyecto] = useState(false);

  const [desde, setDesde] = useState();
  const [hasta, setHasta] = useState();
  const [search, setSearch] = useState("");

  const navigateTo = useNavigate();

  proyectos.sort((a, b) => {
    return (
      new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime()
    );
  });

  console.log(proyectos);

  const getProyectosByIdFunction = async (event) => {
    if (event.target.value !== "") {
      const data = await getProyectosById(event.target.value);
      console.log(data);
      setProyectos(data);
    } else {
      const data = await getProyectos();
      setProyectos(data);
    }
  };

  const getProyectosByEstado = async (event) => {
    console.log(event.target.value);
    if (event.target.value !== "") {
      const data = await getProyectos();
      setProyectos(
        data.filter((element) => {
          return element.estado == event.target.value;
        })
      );
    } else {
      const data = await getProyectos();
      setProyectos(data);
    }
  };

  const filterEtiquetas = async (e) => {
    e.preventDefault();

    if (e.target.value == "") {
      const data = await getProyectos();
      setProyectos(data);
    } else {
      const data = await getProyectos();
      const filtered = data.filter((element) => {
        return element.etiqueta_nombre === e.target.value;
      });

      setProyectos(filtered);
    }
  };

  const filterClientes = async () => {
    const allProyectos = await getProyectos();
    const filtered = allProyectos.filter((element) => {
      return element.cliente_nombre
        .toLowerCase()
        .includes(search.toLowerCase());
    });
    if (search !== "") {
      setProyectos(filtered);
    } else {
      setProyectos(allProyectos);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const {
      nombre,
      cliente,
      etiqueta,
      comentarios,
      fecha_inicio,
      fecha_entrega,
    } = data;

    try {
      const created = await createProyecto(
        cliente,
        nombre,
        comentarios,
        fecha_inicio,
        fecha_entrega,
        etiqueta
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

      setProyectos([created[0], ...proyectos]);
      reset();
      setViewInsertProyecto(false);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const filterByDate = async (e) => {
    e.preventDefault();

    try {
      const data = await getProyectos();
      setProyectos(
        data.filter((element) => {
          const fechaInicial = new Date(desde);
          const fechaFinal = new Date(hasta);

          const dateElement = new Date(element.fecha_entrega);
          return (
            dateElement.getTime() > fechaInicial.getTime() - 86401 &&
            dateElement.getTime() < fechaFinal.getTime() + 86400
          );
        })
      );
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const onChangeDesde = (e) => {
    setDesde(e.target.value);
  };

  const onChangeHasta = (e) => {
    setHasta(e.target.value);
  };

  const handeOnChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const nuevaEtiqueta = () => {
    console.log("nueva");
  };

  return (
    <div className="proyectos-container">
      <div className="btn-insertar-container">
        {nivel !== "empleado" && (
          <button
            className="btn-insertar"
            onClick={() => setViewInsertProyecto(true)}
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
            <input
              type="date"
              id="fecha_desde"
              name="fecha_desde"
              onChange={(e) => onChangeDesde(e)}
            ></input>
            <input
              type="date"
              id="fecha_hasta"
              name="fecha_hasta"
              onChange={(e) => onChangeHasta(e)}
            ></input>
            <button onClick={(event) => filterByDate(event)}>
              Busqueda por fecha
            </button>
            <label>Cliente</label>
            <input
              type="text"
              name="cliente"
              id="cliente"
              onChange={handeOnChangeSearch}
            ></input>
            <button type="button" onClick={() => filterClientes()}>
              Buscar
            </button>

            <label>Empleado</label>
            <select
              name="empleados"
              id="empleados"
              onChange={(event) => getProyectosByIdFunction(event)}
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
              onChange={(event) => getProyectosByEstado(event)}
            >
              <option value={""}>TODOS</option>
              <option value={"en curso"}>EN CURSO</option>
              <option value={"finalizado"}>FINALIZADO</option>
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

      <div className="contenedor-proyectos">
        {proyectos.map((element, index) => {
          const date = new Date(element.fecha_entrega);
          return (
            <div
              className={
                element.estado == "finalizado" ? "finalizado" : "proyectos-box"
              }
              key={index}
              onClick={async () => {
                setIdProyecto(element.id);
                navigateTo("/proyectoDetalle");
                setEmpleadosAsignados(
                  await getProyectosByIdProyecto(element.id)
                );
              }}
            >
              <div className="elementos-box">
                <label className="proyecto-nombre">{element.nombre}</label>

                <label>CLiente: {element.cliente_nombre}</label>
                <label>{element.etiqueta_nombre}</label>
                <label>Fecha Entrega</label>
                <label>{`${date.getDate()}/${
                  date.getMonth() + 1
                }/${date.getFullYear()}`}</label>
              </div>
            </div>
          );
        })}
      </div>
      {viewInsertProyecto && (
        <div className="empleado-create-modal-container">
          <div className="empleado-create-modal">
            <form
              className="form-container"
              method="post"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label>Nombre Proyecto</label>
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
              <div>
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
                <button type="button" onClick={() => nuevaEtiqueta()}>
                  +
                </button>
              </div>

              {errors.etiqueta?.type === "required" && (
                <span>Campo requerido</span>
              )}

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

              <label>Fecha Entrega</label>
              <input
                type="date"
                id="fecha_entrega"
                {...register("fecha_entrega", {
                  required: true,
                })}
              />
              {errors.fecha_entrega?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <label>Comentarios</label>
              <textarea
                id="comentarios"
                placeholder="Comentarios"
                className="comentarios-input"
                {...register("comentarios", {
                  required: true,
                })}
              />
              {errors.comentarios?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <div className="modal-actions">
                <button type="submit">CREAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewInsertProyecto(false);
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

export default Proyectos;
