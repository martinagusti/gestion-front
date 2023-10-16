import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./servicioDetalle.css";

import { AuthContext } from "../context/AuthContext";
import {
  createEmpleadoAsignadoByServicio,
  createTarea,
  deleteEmpleadoAsignadoByServicio,
  deleteServicio,
  deleteServicioArchivo,
  deleteTarea,
  deleteTareaArchivo,
  editServicio,
  getArchivos,
  getServicios,
  getServiciosArchivos,
  getTareas,
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

function ServicioDetalle({
  servicios,
  setServicios,
  nivel,
  empleados,
  etiquetas,
  setIdServicio,
  setEmpleadosAsignadosByServicio,
  empleadosAsignadosByServicio,
  idServicio,
  clientes,
  serviciosArchivos,
  setServiciosArchivos,
  tareas,
  setTareas,
  archivos,
  setArchivos,
  tareaId,
  setTareaId,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();
  const [viewDeleteServicioModal, setViewDeleteServicioModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [viewServicioFileModal, setViewServicioFileModal] = useState(false);
  const [servicioFileName, setServicioFileName] = useState("");
  const [viewInsertTarea, setViewInsertTarea] = useState(false);
  const [viewDeleteTarea, setViewDeleteTarea] = useState(false);
  const [viewInsertEmpleado, setViewInsertEmpleado] = useState();
  const [viewDeleteEmpleadoAsignado, setViewDeleteEmpleadoAsignado] =
    useState(false);
  const [idEmpleado, setIdEmpleado] = useState();
  const [viewFileModal, setViewFileModal] = useState(false);
  const [fileId, setFileId] = useState();
  const [fileName, setFileName] = useState("");
  const [deleteTareaId, setDeleteTareaId] = useState(null);

  const navigateTo = useNavigate();

  const user = JSON.parse(localStorage.getItem("gestionUser"));

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

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
    reset: reset3,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const { nombre, cliente, etiqueta, estado, fecha_inicio, comentarios } =
      data;

    try {
      if (value == `<p></p>` || value == "" || value == "<p><br></p>") {
        setErrorText("Debe completar todos los campos");
      } else {
        const updated = await editServicio(
          cliente,
          etiqueta,
          nombre,
          value,
          fecha_inicio,
          estado,
          comentarios,
          idServicio
        );

        console.log(updated);
        setServicios(await getServicios());
        reset();
        setEditando(false);
        setErrorText(null);
      }
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const onSubmit2 = async (data, e) => {
    e.preventDefault();

    console.log(data);

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
        null,
        idServicio,
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

  const onSubmit3 = async (data, e) => {
    e.preventDefault();

    const { empleado } = data;

    try {
      const created = await createEmpleadoAsignadoByServicio(
        idServicio,
        parseInt(empleado)
      );

      let empleadoData = empleados.filter((element) => {
        return element.id == empleado;
      });

      created[0].nombre = empleadoData[0].nombre;
      created[0].apellido = empleadoData[0].apellido;
      created[0].nivel = empleadoData[0].nivel;

      setEmpleadosAsignadosByServicio([
        created[0],
        ...empleadosAsignadosByServicio,
      ]);
      reset();
      setViewInsertEmpleado(false);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  tareas = tareas.filter((element) => {
    return element.id_servicio == idServicio;
  });

  tareas.sort((a, b) => {
    const date = new Date(a.fecha_final);
    const date2 = new Date(b.fecha_final);
    return date.getTime() - date2.getTime();
  });

  console.log(tareas);

  servicios = servicios.filter((element) => {
    return element.id === idServicio;
  });

  serviciosArchivos = serviciosArchivos.filter((element) => {
    return element.id_servicio == idServicio;
  });

  const [value, setValue] = useState(servicios[0]?.descripcion);

  const deleteServicioModal = () => {
    setViewDeleteServicioModal(true);
  };

  const deleteServicioFunction = async () => {
    try {
      const deleted = await deleteServicio(idServicio);
      console.log(deleted);
      setServicios(
        servicios.filter((element) => {
          return element.id != idServicio;
        })
      );

      navigateTo("/servicios");
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const fechaInicio = new Date(servicios[0].fecha_inicio);
  let dia = fechaInicio.getDate();
  if (dia < 10) {
    dia = `0${dia}`;
  }
  let mes = fechaInicio.getMonth() + 1;
  if (mes < 10) {
    mes = `0${mes}`;
  }
  const fechaToEdit = `${fechaInicio.getFullYear()}-${mes}-${dia}`;

  const getProyectoArchivosFunction = async () => {
    setViewServicioFileModal(true);
  };

  const handleOnChangeServicioFileName = (e) => {
    setServicioFileName(e.target.value);
  };

  const cargarServicioArchivo = async () => {
    const date = new Date();

    setTimeout(async () => {
      const archivosServicio = await getServiciosArchivos();

      setServiciosArchivos(archivosServicio);
    }, 1000);
  };

  const deleteServicioArchivoFunction = async (element) => {
    try {
      const deleted = await deleteServicioArchivo(element.id);
      if (deleted) {
        setServiciosArchivos(
          serviciosArchivos.filter((archivo) => {
            return archivo.id !== element.id;
          })
        );
      }
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
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

  const deleteEmpleadoAsignadoFunction = async () => {
    try {
      const deleted = await deleteEmpleadoAsignadoByServicio(
        idServicio,
        parseInt(idEmpleado)
      );
      setEmpleadosAsignadosByServicio(
        empleadosAsignadosByServicio.filter((empleado) => {
          return empleado.id_empleado != idEmpleado;
        })
      );
      setViewDeleteEmpleadoAsignado(false);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
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

  const viewTarea = (element) => {
    setTareaId(element.id);
    navigateTo("/tareaDetalle");
  };

  console.log(empleadosAsignadosByServicio);

  return (
    <div className="serviciosDetalle-container">
      <div className="servicio-info">
        <h3>Nombre: {servicios[0].nombre}</h3>
        <h3>Cliente: {servicios[0].cliente_nombre}</h3>
        <h3>Etiqueta: {servicios[0].etiqueta_nombre}</h3>
        <h3>
          Fecha inicio: {fechaInicio.getDate()}/{fechaInicio.getMonth() + 1}/
          {fechaInicio.getFullYear()}
        </h3>
        <h3>Estado: {servicios[0].estado}</h3>
        <div className="descripcion-servicio-container">
          <div
            className="texto"
            dangerouslySetInnerHTML={{ __html: servicios[0].descripcion }}
          ></div>
        </div>
        <h3>Comentarios: {servicios[0].comentarios}</h3>
        {nivel !== "empleado" && (
          <button onClick={() => setEditando(true)}>EDITAR</button>
        )}
        {nivel !== "empleado" && (
          <button onClick={() => deleteServicioModal()}>ELIMINAR</button>
        )}
        <button onClick={() => getProyectoArchivosFunction()}>ARCHIVOS</button>
      </div>
      {viewDeleteServicioModal && (
        <div className="delete-modal-container">
          <div className="delete-modal">
            <h2>
              ¿Seguro desea eliminar este Servicio? Esto afectara las tareas
              asignadas a el.
            </h2>
            <div className="modal-actions">
              <button onClick={() => deleteServicioFunction()}>ACEPTAR</button>
              <button
                onClick={() => {
                  setViewDeleteServicioModal(false);
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {editando && (
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
                defaultValue={servicios[0].nombre}
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
                    defaultValue={servicios[0].id_cliente}
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
                    defaultValue={servicios[0].id_etiqueta}
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
                    defaultValue={servicios[0].estado}
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
                  defaultValue={fechaToEdit}
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
                defaultValue={value}
                onChange={setValue}
                className="editor-input"
                modules={modules}
                id="descripcion"
              />

              <label>Comentarios</label>
              <textarea
                id="comentarios"
                defaultValue={servicios[0].comentarios}
                {...register("comentarios", {})}
              ></textarea>

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
              {errorText && <span>{errorText}</span>}
            </form>
          </div>
        </div>
      )}

      {viewServicioFileModal && (
        <div className="modal-container">
          <div className="modal">
            <div className="archivos-container">
              {serviciosArchivos.map((element, index) => {
                return (
                  <div key={index} className="archivos">
                    <a
                      href={`${
                        import.meta.env.VITE_BACKEND_URL
                      }/serviciosFiles/${element.nombre}`}
                      target="_blank"
                      download="archivo.txt"
                    >
                      {element.nombre}
                    </a>
                    {nivel !== "empleado" && (
                      <button
                        className="empleados-btn-eliminar"
                        onClick={() => deleteServicioArchivoFunction(element)}
                      ></button>
                    )}
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={() => cargarServicioArchivo()}
              action={`${
                import.meta.env.VITE_BACKEND_URL
              }/servicios/files/${idServicio}`}
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
                onChange={handleOnChangeServicioFileName}
                multiple
              />

              {errorText && <span>{errorText}</span>}
              <div className="modal-actions">
                <button type="submit">ENVIAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewServicioFileModal(false);
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
              {empleadosAsignadosByServicio?.map((element, index) => {
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
          {empleadosAsignadosByServicio?.map((element, index) => {
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
                <td onClick={() => viewTarea(element)}>{element.titulo}</td>
                <td onClick={() => viewTarea(element)}>
                  {element.descripcion}
                </td>
                <td onClick={() => viewTarea(element)}>
                  {element.nombre} {element.apellido}
                </td>
                <td
                  onClick={() => viewTarea(element)}
                >{`${fechaComienzo.getDate()}/${
                  fechaComienzo.getMonth() + 1
                }/${fechaComienzo.getFullYear()}`}</td>
                <td
                  onClick={() => viewTarea(element)}
                >{`${fechaFinal.getDate()}/${
                  fechaFinal.getMonth() + 1
                }/${fechaFinal.getFullYear()}`}</td>

                <td onClick={() => viewTarea(element)}>{element.prioridad}</td>
                <td
                  onClick={() => viewTarea(element)}
                  className={element.estado == "resuelta" ? "resuelta" : ""}
                >
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

      {viewInsertEmpleado && (
        <div className="modal-container">
          <div className="modal">
            <form
              className="form-edit-container"
              method="post"
              onSubmit={handleSubmit3(onSubmit3)}
            >
              <select
                name="empleado"
                id="empleado"
                {...register3("empleado", {
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

              {errors3.empleado?.type === "required" && (
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
                {empleadosAsignadosByServicio.map((element, index) => {
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
    </div>
  );
}

export default ServicioDetalle;
