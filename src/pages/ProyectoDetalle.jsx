import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./proyectoDetalle.css";

import { AuthContext } from "../context/AuthContext";
import {
  createTarea,
  deleteTarea,
  deleteTareaArchivo,
  editTarea,
  getArchivos,
  getProyectosByIdProyecto,
  getTareas,
} from "../services";
import {
  createEmpleadoAsignado,
  deleteEmpleadoAsignado,
  deleteProyecto,
  deleteProyectoArchivo,
  editProyecto,
  getProyectoArchivos,
  getProyectos,
} from "../services/proyectosService";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      {
        color: ["black", "red", "blue", "yellow", "green", "orange"],
      },
    ],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { list: "+1" }],
    ["link", "image"],
  ],
};

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
  proyectoArchivos,
  setProyectoArchivos,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();
  const [viewInsertEmpleado, setViewInsertEmpleado] = useState();
  const [viewDeleteProyecto, setViewDeleteProyecto] = useState(false);
  const [editando, setEditando] = useState(false);

  const [viewInsertTarea, setViewInsertTarea] = useState(false);
  const [viewDeleteTarea, setViewDeleteTarea] = useState(false);
  const [viewDeleteEmpleadoAsignado, setViewDeleteEmpleadoAsignado] =
    useState(false);
  const [viewEditTarea, setViewEditTarea] = useState(false);
  const [deleteTareaId, setDeleteTareaId] = useState(null);
  const [viewFileModal, setViewFileModal] = useState(false);
  const [viewProyectoFileModal, setViewProyectoFileModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [proyectoFileName, setProyectoFileName] = useState("");
  const [fileId, setFileId] = useState();
  const [editTareaId, setEditTareaId] = useState();
  const [editTareaEstado, setEditTareaEstado] = useState("");
  const [idEmpleado, setIdEmpleado] = useState();

  const navigateTo = useNavigate();

  const user = JSON.parse(localStorage.getItem("gestionUser"));

  console.log(proyectoArchivos);
  proyectoArchivos = proyectoArchivos.filter((element) => {
    return element.id_proyecto == idProyecto;
  });

  tareas = tareas.filter((element) => {
    return element.id_proyecto == idProyecto;
  });

  tareas.sort((a, b) => {
    const date = new Date(a.fecha_final);
    const date2 = new Date(b.fecha_final);
    return date.getTime() - date2.getTime();
  });

  incidencias = incidencias.filter((element) => {
    return element.id_proyecto == idProyecto;
  });

  proyectos = proyectos.filter((element) => {
    return element.id === idProyecto;
  });

  const [nombre, setNombre] = useState(proyectos[0]?.nombre);
  const [comentarios, setComentarios] = useState(proyectos[0]?.comentarios);
  const [value, setValue] = useState(proyectos[0]?.comentarios);

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
        null,
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

  const deleteEmpleadoAsignadoFunction = async () => {
    try {
      const deleted = await deleteEmpleadoAsignado(
        idProyecto,
        parseInt(idEmpleado)
      );
      setEmpleadosAsignados(
        empleadosAsignados.filter((empleado) => {
          return empleado.id_empleado != idEmpleado;
        })
      );
      setViewDeleteEmpleadoAsignado(false);
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
        value,
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

  const handleOnChangeProyectoFileName = (e) => {
    setProyectoFileName(e.target.value);
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

  const cargarProyectoArchivo = async () => {
    const date = new Date();

    setTimeout(async () => {
      const archivosProyecto = await getProyectoArchivos();

      setProyectoArchivos(archivosProyecto);
    }, 1000);
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

  const deleteProyectoArchivoFunction = async (element) => {
    try {
      const deleted = await deleteProyectoArchivo(element.id);
      if (deleted) {
        setProyectoArchivos(
          proyectoArchivos.filter((archivo) => {
            return archivo.id !== element.id;
          })
        );
      }
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const editTareaFunction = async (event) => {
    event.preventDefault();
    if (editTareaEstado !== "") {
      try {
        const edited = await editTarea(editTareaId, editTareaEstado);
        console.log(edited);
        if (edited) {
          setTareas(await getTareas());
          setViewEditTarea(false);
        }
      } catch (error) {
        console.log(error);
        setErrorText(error.response.data.error);
      }
    }
  };

  const handleOnChangeEditTarea = (e) => {
    setEditTareaEstado(e.target.value);
  };

  const handleOnChangeFilterTareaEmpleado = async (e) => {
    const todos = await getTareas();
    if (e.target.value !== "") {
      setTareas(
        todos.filter((element) => {
          return element.id_empleado == e.target.value;
        })
      );
    } else {
      setTareas(todos);
    }
  };

  const getProyectoArchivosFunction = async () => {
    setViewProyectoFileModal(true);
  };

  console.log(empleadosAsignados);

  return (
    <div className="proyectoDetalle-container">
      <button onClick={() => getProyectoArchivosFunction()}>Archivos</button>
      {proyectos.map((element, index) => {
        const fechaInicio = new Date(element.fecha_inicio);
        const fechaEntrega = new Date(element.fecha_entrega);

        return (
          <div key={index} className="detalle-container">
            <h2>{element.nombre}</h2>
            <h2>{element.cliente_nombre}</h2>
            <h2>{element.etiqueta_nombre}</h2>
            <div className="mensaje-container">
              <div
                className="texto"
                dangerouslySetInnerHTML={{ __html: element.comentarios }}
              ></div>
            </div>
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
                        onClick={() => {
                          setViewDeleteEmpleadoAsignado(true);
                          setIdEmpleado(element.id_empleado);
                        }}
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
                <option value="pendiente">PENDIENTE</option>
                <option value="en curso">EN CURSO</option>
                <option value="finalizado">FINALIZADO</option>
              </select>

              <label>Comentarios</label>

              <ReactQuill
                theme="snow"
                defaultValue={value}
                onChange={setValue}
                className="editor-input"
                modules={modules}
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
      <h2>TAREAS</h2>
      {nivel !== "empleado" && (
        <div className="btn-insertar-container">
          <button
            type="button"
            className="btn-insertar"
            onClick={() => setViewInsertTarea(true)}
          >
            NUEVA
          </button>
        </div>
      )}
      <div className="filtros-tareas">
        <label>Empleado</label>
        <select
          name="filtroTareaEmpleado"
          id="filtroTareaEmpleado"
          onChange={handleOnChangeFilterTareaEmpleado}
        >
          <option value="">TODOS</option>
          {empleadosAsignados?.map((element, index) => {
            return (
              <option
                key={index}
                value={element.id_empleado}
              >{`${element.nombre} ${element.apellido}`}</option>
            );
          })}
        </select>

        {/*   <label>Estado</label>
        <select
          name="filtroTareaEstado"
          id="filtroTareaEstado"
          onChange={handleOnChangeFilterTareaEstado}
        >
          <option value="">TODOS</option>
          <option value="pendiente">Pendiente</option>
          <option value="en proceso">En Proceso</option>
          <option value="resuelta">Resuelta</option>
        </select> */}
      </div>
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
                <td className={element.estado == "resuelta" ? "resuelta" : ""}>
                  {element.estado}
                </td>

                <td className="actions-btn-container">
                  <button
                    onClick={() => {
                      setViewFileModal(true);
                      setFileId(element.id);
                    }}
                    className="btn-archivo"
                  ></button>
                  <button
                    onClick={() => {
                      if (
                        element.id_empleado == user.id ||
                        nivel !== "empleado"
                      ) {
                        setViewEditTarea(true);
                        setEditTareaId(element.id);
                        setEditTareaEstado(element.estado);
                      }
                    }}
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
              <label>Usuario Asignado</label>
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
      {viewDeleteEmpleadoAsignado && (
        <div className="delete-modal-container">
          <div className="delete-modal">
            <h2>
              ¿Seguro desea eliminar este usuario? Esto afectara las tareas
              asignadas a el.
            </h2>
            <div className="modal-actions">
              <button onClick={() => deleteEmpleadoAsignadoFunction()}>
                ACEPTAR
              </button>
              <button
                onClick={() => {
                  setViewDeleteEmpleadoAsignado(false);
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
      {viewEditTarea && (
        <div className="modal-container">
          <div className="modal">
            <h2>Editar Tarea</h2>
            <select
              name="estado"
              id="estado"
              onChange={handleOnChangeEditTarea}
              defaultValue={editTareaEstado}
            >
              <option value="">Estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En Proceso</option>
              <option value="resuelta">Resuelta</option>
            </select>
            <div className="modal-actions">
              <button onClick={(event) => editTareaFunction(event)}>
                ACEPTAR
              </button>
              <button
                onClick={() => {
                  setViewEditTarea(false);
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
              <input
                type="file"
                name="file"
                id=""
                /* defaultValue={fileName} */
                onChange={handleOnChangeFileName}
                multiple
              />

              {errorText && <span>{errorText}</span>}
              <div className="modal-actions">
                <button type="submit">ENVIAR</button>
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

      {viewProyectoFileModal && (
        <div className="modal-container">
          <div className="modal">
            <div className="archivos-container">
              {proyectoArchivos.map((element, index) => {
                return (
                  <div key={index} className="archivos">
                    <a
                      href={`${
                        import.meta.env.VITE_BACKEND_URL
                      }/proyectosFiles/${element.nombre}`}
                      target="_blank"
                      download="archivo.txt"
                    >
                      {element.nombre}
                    </a>
                    {nivel !== "empleado" && (
                      <button
                        className="empleados-btn-eliminar"
                        onClick={() => deleteProyectoArchivoFunction(element)}
                      ></button>
                    )}
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={() => cargarProyectoArchivo()}
              action={`${
                import.meta.env.VITE_BACKEND_URL
              }/proyectos/files/${idProyecto}`}
              target="_blank"
              method="post"
              encType="multipart/form-data"
              className="form-edit-container"
            >
              <input
                type="file"
                name="file"
                id=""
                /* defaultValue={fileName} */
                onChange={handleOnChangeProyectoFileName}
                multiple
              />

              {errorText && <span>{errorText}</span>}
              <div className="modal-actions">
                <button type="submit">ENVIAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewProyectoFileModal(false);
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
