import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./proyectoDetalle.css";

import { AuthContext } from "../context/AuthContext";
import { getProyectosByIdProyecto } from "../services";
import {
  createEmpleadoAsignado,
  deleteEmpleadoAsignado,
  deleteProyecto,
  editProyecto,
  getProyectos,
} from "../services/proyectosService";

function ProyectoDetalle({
  proyectos,
  setProyectos,
  idProyecto,
  empleadosAsignados,
  setEmpleadosAsignados,
  empleados,
  nivel,
  etiquetas,
  incidencias,
  tareas,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();
  const [viewInsertEmpleado, setViewInsertEmpleado] = useState();
  const [viewDeleteProyecto, setViewDeleteProyecto] = useState(false);
  const [editando, setEditando] = useState(false);

  const navigateTo = useNavigate();

  tareas = tareas.filter((element) => {
    return element.id_proyecto == idProyecto;
  });

  console.log(tareas);

  incidencias = incidencias.filter((element) => {
    return element.id_proyecto == idProyecto;
  });

  proyectos = proyectos.filter((element) => {
    return element.id === idProyecto;
  });

  const [nombre, setNombre] = useState(proyectos[0]?.nombre);
  const [comentarios, setComentarios] = useState(proyectos[0]?.comentarios);

  const fechaEntrega = new Date(proyectos[0]?.fecha_entrega);
  let dia = fechaEntrega.getDate();
  if (dia < 10) {
    dia = `0${dia}`;
  }
  let mes = fechaEntrega.getMonth() + 1;
  if (mes < 10) {
    mes = `0${mes}`;
  }
  const [fecha_entrega, setFecha_entrega] = useState(
    `${fechaEntrega.getFullYear()}-${mes}-${dia}`
  );

  const [etiqueta, setEtiqueta] = useState(proyectos[0]?.etiqueta_nombre);
  const [estado, setEstado] = useState(proyectos[0]?.estado);
  const [idEdit, setIdEdit] = useState(proyectos[0]?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const { empleado } = data;

    try {
      const created = await createEmpleadoAsignado(idProyecto, empleado);

      let empleadoData = empleados.filter((element) => {
        return element.id == empleado;
      });

      console.log(empleadoData);

      created[0].nombre = empleadoData[0].nombre;
      created[0].apellido = empleadoData[0].apellido;
      created[0].nivel = empleadoData[0].nivel;

      setEmpleadosAsignados([created[0], ...empleadosAsignados]);
      reset();
      setViewInsertEmpleado(false);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const deleteEmpleadoFunction = async (element) => {
    console.log(element.id_proyecto);
    console.log(parseInt(element.id_empleado));

    try {
      const deleted = await deleteEmpleadoAsignado(
        element.id_proyecto,
        parseInt(element.id_empleado)
      );
      setEmpleadosAsignados(
        empleadosAsignados.filter((empleado) => {
          return empleado.id_empleado != element.id_empleado;
        })
      );
      console.log(deleted);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const deleteProyectoFunction = () => {
    setViewDeleteProyecto(true);
  };

  const confirmDelete = async () => {
    try {
      const deleted = await deleteProyecto(idProyecto);
      if (deleted) {
        setViewDeleteProyecto(false);
        const data = await getProyectos();
        setProyectos(data);
        navigateTo("/proyectos");
      }
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const editarProyecto = () => {
    setEditando(true);
  };

  const editar = async (event) => {
    event.preventDefault();
    console.log(event.target);
    try {
      const edited = await editProyecto(
        event.target.nombre.value,
        event.target.comentarios.value,
        event.target.fecha_entrega.value,
        event.target.etiqueta.value,
        event.target.estado.value,
        idEdit
      );

      console.log(edited);

      setProyectos(await getProyectos());
      setEditando(false);
      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const handleOnChangeNombre = (e) => {
    setNombre(e.target.value);
  };

  const handleOnChangeComentarios = (e) => {
    setComentarios(e.target.value);
  };

  const handleOnChangeFechaEntrega = (e) => {
    setFecha_entrega(e.target.value);
  };

  const handleOnChangeEtiqueta = (e) => {
    setEtiqueta(e.target.value);
  };

  const handleOnChangeEstado = (e) => {
    setEstado(e.target.value);
  };

  return (
    <div className="proyectoDetalle-container">
      {proyectos.map((element, index) => {
        const fechaInicio = new Date(element.fecha_inicio);
        const fechaEntrega = new Date(element.fecha_entrega);

        return (
          <div key={index}>
            <h2>{element.nombre}</h2>
            <h2>{element.cliente_nombre}</h2>
            <h2>{element.etiqueta_nombre}</h2>
            <h2>{element.comentarios}</h2>
            <h2>{element.estado}</h2>
            <h2>{`${fechaInicio.getDate()}/${
              fechaInicio.getMonth() + 1
            }/${fechaInicio.getFullYear()}`}</h2>
            <h2>{`${fechaEntrega.getDate()}/${
              fechaEntrega.getMonth() + 1
            }/${fechaEntrega.getFullYear()}`}</h2>
            {nivel !== "empleado" && (
              <div className="box-table-content">
                <button onClick={() => editarProyecto()}>
                  EDITAR PROYECTO
                </button>
                <button onClick={() => deleteProyectoFunction()}>
                  ELIMINAR PROYECTO
                </button>
                <label>Empleados Asignados al Proyecto</label>

                <table className="content-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Apellidos</th>
                      <th>Nivel</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {empleadosAsignados?.map((element, index) => {
                      return (
                        <tr key={index}>
                          <td>{element.nombre}</td>
                          <td>{element.apellido}</td>
                          <td>{element.nivel}</td>

                          <td>
                            <button
                              onClick={() => deleteEmpleadoFunction(element)}
                              className="empleados-btn-eliminar"
                            ></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button onClick={() => setViewInsertEmpleado(true)}>
                  AGREGAR
                </button>
              </div>
            )}
          </div>
        );
      })}
      {viewInsertEmpleado && (
        <div className="etiqueta-create-modal-container">
          <div className="etiqueta-create-modal">
            <form
              className="etiqueta-form-container"
              method="post"
              onSubmit={handleSubmit(onSubmit)}
            >
              <select
                name="empleado"
                id="empleado"
                {...register("empleado", {
                  required: true,
                })}
              >
                {empleados.map((element, index) => {
                  return (
                    <option key={index} value={element.id}>
                      {element.nombre} {element.apellido}
                    </option>
                  );
                })}
              </select>

              {errors.empleado?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <div className="modal-actions">
                <button type="submit">AGREGAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewInsertEmpleado(false);
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

      {viewDeleteProyecto && (
        <div className="modal-container">
          <div className="modal">
            <label>Seguro desea eliminar este proyecto? </label>
            <div className="modal-actions">
              <button
                onClick={() => {
                  confirmDelete();
                }}
              >
                ELIMINAR
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewDeleteProyecto(false);
                  setErrorText(null);
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {editando && (
        <div className="modal-container">
          <div className="modal">
            <form
              className="form-edit-container"
              onSubmit={(event) => {
                editar(event);
              }}
            >
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                defaultValue={nombre}
                onChange={handleOnChangeNombre}
              />

              <label>Comentarios</label>
              <input
                type="text"
                name="comentarios"
                defaultValue={comentarios}
                onChange={handleOnChangeComentarios}
              />

              <label>Fecha Entrega</label>
              <input
                type="date"
                name="fecha_entrega"
                defaultValue={fecha_entrega}
                onChange={handleOnChangeFechaEntrega}
              />

              <label>Etiqueta</label>
              <select
                name="etiqueta"
                id="etiqueta"
                onChange={handleOnChangeEtiqueta}
              >
                {etiquetas.map((element, index) => {
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
                onChange={handleOnChangeEstado}
                defaultValue={estado}
              >
                <option value="en curso">EN CURSO</option>
                <option value="finalizado">FINALIZADO</option>
              </select>

              <div className="modal-actions">
                <button type="submit">GUARDAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setEditando(false);
                    setErrorText(null);
                  }}
                >
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProyectoDetalle;
