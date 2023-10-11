import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./servicioDetalle.css";

import { AuthContext } from "../context/AuthContext";
import {
  deleteServicio,
  deleteServicioArchivo,
  editServicio,
  getServicios,
  getServiciosArchivos,
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
  idServicio,
  clientes,
  serviciosArchivos,
  setServiciosArchivos,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();
  const [viewDeleteServicioModal, setViewDeleteServicioModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [viewServicioFileModal, setViewServicioFileModal] = useState(false);
  const [servicioFileName, setServicioFileName] = useState("");

  const navigateTo = useNavigate();

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

  servicios = servicios.filter((element) => {
    return element.id === idServicio;
  });

  serviciosArchivos = serviciosArchivos.filter((element) => {
    return element.id_servicio == idServicio;
  });

  console.log(serviciosArchivos);

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
    </div>
  );
}

export default ServicioDetalle;
