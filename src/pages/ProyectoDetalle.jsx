import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./proyectoDetalle.css";

import { AuthContext } from "../context/AuthContext";
import {
  createTarea,
  deleteTarea,
  deleteTareaArchivo,
  getArchivos,
  getProyectosByIdProyecto,
} from "../services";
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
  setTareas,
  archivos,
  setArchivos,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();
  const [viewInsertEmpleado, setViewInsertEmpleado] = useState();
  const [viewDeleteProyecto, setViewDeleteProyecto] = useState(false);
  const [editando, setEditando] = useState(false);

  const [viewInsertTarea, setViewInsertTarea] = useState(false);
  const [viewDeleteTarea, setViewDeleteTarea] = useState(false);
  const [deleteTareaId, setDeleteTareaId] = useState(null);
  const [viewFileModal, setViewFileModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileId, setFileId] = useState();

  const navigateTo = useNavigate();

  tareas = tareas.filter((element) => {
    return element.id_proyecto == idProyecto;
  });

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

  const [etiqueta, setEtiqueta] = useState(proyectos[0]?.id_etiqueta);
  const [estado, setEstado] = useState(proyectos[0]?.estado);
  const [idEdit, setIdEdit] = useState(proyectos[0]?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const { empleado } = data;

    try {
      const created = await createEmpleadoAsignado(
        idProyecto,
        parseInt(empleado)
      );

      let empleadoData = empleados.filter((element) => {
        return element.id == empleado;
      });

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

  const onSubmit2 = async (data, e) => {
    e.preventDefault();

    const {
      titulo,
      descripcion,
      empleado2,
      fecha_inicio,
      fecha_final,
      prioridad,
      estado,
    } = data;

    try {
      const created = await createTarea(
        idProyecto,
        empleado2,
        titulo,
        descripcion,
        fecha_inicio,
        fecha_final,
        prioridad,
        estado
      );

      const empleadoData = empleados.filter((element) => {
        return element.id == empleado2;
      });

      created[0].nombre = empleadoData[0].nombre;
      created[0].apellido = empleadoData[0].apellido;

      setTareas([created[0], ...tareas]);
      reset2();
      setViewInsertTarea(false);
      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const deleteEmpleadoFunction = async (element) => {
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

  const viewDeleteTareaFunction = (element) => {
    setDeleteTareaId(element.id);
    setViewDeleteTarea(true);
  };

  const deleteTareaFunction = async () => {
    try {
      const deleted = await deleteTarea(deleteTareaId);

      if (deleted) {
        setTareas(
          tareas.filter((element) => {
            return element.id != deleteTareaId;
          })
        );
        setErrorText(null);
        setViewDeleteTarea(false);
      }

      setViewDeleteTarea(false);
      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const editar = async (event) => {
    event.preventDefault();

    try {
      const edited = await editProyecto(
        event.target.nombre.value,
        event.target.comentarios.value,
        event.target.fecha_entrega.value,
        event.target.etiqueta.value,
        event.target.estado.value,
        idEdit
      );

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

  const handleOnChangeFileName = (e) => {
    setFileName(e.target.value);
  };

  const cargarArchivo = async () => {
    const date = new Date();

    setTimeout(async () => {
      const archivos = await getArchivos();

      setArchivos(archivos);
    }, 1000);

    /* const arr = fileName.split("\\");

    setTareas(
      tareas.map((element) => {
        if (element.id === fileId) {
          element.archivo = `${date.getDate()}${
            date.getMonth() + 1
          }${date.getFullYear()}${arr[arr.length - 1]}`;
        }
        return element;
      })
    ); */
  };

  const deleteArchivo = async (element) => {
    try {
      const deleted = await deleteTareaArchivo(element.id);
      if (deleted) {
        setArchivos(
          archivos.filter((archivo) => {
            return archivo.id !== element.id;
          })
        );
      }
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  return (
    <div className="proyectoDetalle-container">
      {proyectos.map((element, index) => {
        const fechaInicio = new Date(element.fecha_inicio);
        const fechaEntrega = new Date(element.fecha_entrega);

        return (
          <div key={index} className="detalle-container">
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
          </div>
        );
      })}
      {nivel !== "empleado" && (
        <div className="box-table-content">
          <button onClick={() => editarProyecto()}>EDITAR PROYECTO</button>
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
          <button
            onClick={() => {
              setViewInsertEmpleado(true);
              setErrorText(null);
            }}
          >
            AGREGAR
          </button>
        </div>
      )}
      {viewInsertEmpleado && (
        <div className="modal-container">
          <div className="modal">
            <form
              className="form-edit-container"
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
                defaultValue={etiqueta}
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

              <label>Comentarios</label>
              <textarea
                className="comentarios-input"
                type="text"
                name="comentarios"
                defaultValue={comentarios}
                onChange={handleOnChangeComentarios}
              />

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

      <h2>
        Tareas (filtros por empleado, prioridad, estado, ordenar por fecha
        final)
      </h2>
      {nivel !== "empleado" && (
        <button type="button" onClick={() => setViewInsertTarea(true)}>
          NUEVA TAREA
        </button>
      )}

      <table className="content-table">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Descripcion</th>
            <th>Empleado</th>
            <th>Fecha Inicio</th>
            <th>Fecha Final</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tareas?.map((element, index) => {
            const fechaComienzo = new Date(element.fecha_comienzo);
            const fechaFinal = new Date(element.fecha_final);
            return (
              <tr key={index}>
                <td>{element.titulo}</td>
                <td>{element.descripcion}</td>
                <td>
                  {element.nombre} {element.apellido}
                </td>
                <th>{`${fechaComienzo.getDate()}/${
                  fechaComienzo.getMonth() + 1
                }/${fechaComienzo.getFullYear()}`}</th>
                <th>{`${fechaFinal.getDate()}/${
                  fechaFinal.getMonth() + 1
                }/${fechaFinal.getFullYear()}`}</th>

                <td>{element.prioridad}</td>
                <td>{element.estado}</td>

                <td className="actions-btn-container">
                  <button
                    onClick={() => {
                      setViewFileModal(true);
                      setFileId(element.id);
                    }}
                    className="btn-archivo"
                  ></button>
                  <button
                    onClick={() => console.log("Editar funcion")}
                    className="empleados-btn-editar"
                  ></button>
                  {nivel !== "empleado" && (
                    <button
                      onClick={() => viewDeleteTareaFunction(element)}
                      className="empleados-btn-eliminar"
                    ></button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {viewInsertTarea && (
        <div className="modal-container">
          <div className="modal">
            <form
              className="form-container"
              method="get"
              onSubmit={handleSubmit2(onSubmit2)}
            >
              <input
                type="text"
                id="titulo"
                placeholder="Titulo"
                {...register2("titulo", {
                  required: true,
                })}
              />
              {errors2.titulo?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <textarea
                className="descripcion-input"
                id="descripcion"
                placeholder="Descripcion"
                {...register2("descripcion", {
                  required: true,
                })}
              />
              {errors2.descripcion?.type === "required" && (
                <span>Campo requerido</span>
              )}
              <label>Responsable</label>
              <select
                name="empleado2"
                id="empleado2"
                {...register2("empleado2", {
                  required: true,
                })}
              >
                {empleadosAsignados.map((element, index) => {
                  return (
                    <option key={index} value={element.id_empleado}>
                      {element.nombre} {element.apellido}
                    </option>
                  );
                })}
              </select>

              {errors2.empleado2?.type === "required" && (
                <span>Campo requerido</span>
              )}
              <label>Fecha Inicio</label>
              <input
                type="date"
                id="fecha_inicio"
                {...register2("fecha_inicio", {
                  required: true,
                })}
              />
              {errors2.fecha_inicio?.type === "required" && (
                <span>Campo requerido</span>
              )}
              <label>Fecha Final</label>
              <input
                type="date"
                id="fecha_final"
                {...register2("fecha_final", {
                  required: true,
                })}
              />
              {errors2.fecha_final?.type === "required" && (
                <span>Campo requerido</span>
              )}
              <label>Prioridad</label>
              <select
                name="prioridad"
                id="prioridad"
                {...register2("prioridad", {
                  required: true,
                })}
              >
                <option value="normal">Normal</option>
                <option value="baja">Baja</option>
                <option value="alta">Alta</option>
              </select>
              <label>Estado</label>
              <select
                name="estado"
                id="estado"
                {...register2("estado", {
                  required: true,
                })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en proceso">En Proceso</option>
                <option value="resuelta">Resuelta</option>
              </select>

              <div className="modal-actions">
                <button type="submit">AGREGAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewInsertTarea(false);
                    setErrorText(null);
                    reset2();
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

      {viewDeleteTarea && (
        <div className="delete-modal-container">
          <div className="delete-modal">
            <h2>¿Seguro desea eliminar esta tarea?</h2>
            <div className="modal-actions">
              <button onClick={() => deleteTareaFunction()}>ACEPTAR</button>
              <button
                onClick={() => {
                  setViewDeleteTarea(false);
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {viewFileModal && (
        <div className="modal-container">
          <div className="modal">
            <div className="archivos-container">
              {archivos
                .filter((element) => {
                  return element.id_tarea == fileId;
                })
                .map((element, index) => {
                  return (
                    <div key={index} className="archivos">
                      <a
                        href={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/tareasFiles/${element.nombre}`}
                        target="_blank"
                        download="archivo.txt"
                      >
                        {element.nombre}
                      </a>
                      {nivel !== "empleado" && (
                        <button
                          className="empleados-btn-eliminar"
                          onClick={() => deleteArchivo(element)}
                        ></button>
                      )}
                    </div>
                  );
                })}
            </div>

            <form
              onSubmit={() => cargarArchivo()}
              action={`${
                import.meta.env.VITE_BACKEND_URL
              }/tareas/files/${fileId}`}
              target="_blank"
              method="post"
              encType="multipart/form-data"
              className="form-edit-container"
            >
              {nivel !== "empleado" && (
                <input
                  type="file"
                  name="file"
                  id=""
                  /* defaultValue={fileName} */
                  onChange={handleOnChangeFileName}
                  multiple
                />
              )}
              {errorText && <span>{errorText}</span>}
              <div className="modal-actions">
                {nivel !== "empleado" && <button type="submit">ENVIAR</button>}
                <button
                  type="button"
                  onClick={() => {
                    setViewFileModal(false);
                    setErrorText(null);
                  }}
                >
                  SALIR
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
