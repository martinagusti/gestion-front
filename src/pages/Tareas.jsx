import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./tareas.css";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { createTarea, getTareas } from "../services";

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

function Tareas({ tareas, setTareas, nivel, tareaId, setTareaId, empleados }) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();
  const [clase, setClase] = useState("");
  const [viewInsertTarea, setViewInsertTarea] = useState(false);

  const [value, setValue] = useState("");

  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    console.log(data);

    const { titulo, empleado, fecha_inicio, fecha_final, prioridad, estado } =
      data;

    try {
      const created = await createTarea(
        null,
        null,
        empleado,
        titulo,
        value,
        fecha_inicio,
        fecha_final,
        prioridad,
        estado
      );

      const empleadoData = empleados.filter((element) => {
        return element.id == empleado;
      });

      created[0].nombre = empleadoData[0].nombre;
      created[0].apellido = empleadoData[0].apellido;

      setTareas([created[0], ...tareas]);
      reset();
      setViewInsertTarea(false);
      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const createNewTarea = () => {
    setViewInsertTarea(true);
  };

  const filterByClase = async (e) => {
    console.log(e.target.value);

    if (e.target.value == "") {
      const alltareas = await getTareas();
      const filtered = alltareas.filter((element) => {
        return element;
      });
      setTareas(filtered);
    } else if (e.target.value == "proyectos") {
      const alltareas = await getTareas();
      const filtered = alltareas.filter((element) => {
        return element.id_proyecto != null;
      });
      setTareas(filtered);
    } else if (e.target.value == "servicios") {
      const alltareas = await getTareas();
      const filtered = alltareas.filter((element) => {
        return element.id_servicio != null;
      });
      setTareas(filtered);
    } else {
      const alltareas = await getTareas();
      const filtered = alltareas.filter((element) => {
        return element.id_servicio == null && element.id_proyecto == null;
      });
      setTareas(filtered);
    }
  };

  const viewTarea = (element) => {
    setTareaId(element.id);
    navigateTo("/tareaDetalle");
  };

  const filterByEmpleado = async (event) => {
    if (event.target.value == "") {
      const data = await getTareas();

      setTareas(data);
    } else {
      const data = await getTareas();
      setTareas(
        data.filter((element) => {
          const nombreCompleto = `${element.nombre} ${element.apellido}`;
          return nombreCompleto == event.target.value;
        })
      );
    }
  };

  console.log(tareas);

  return (
    <div className="tareas-container">
      <div className="btn-insertar-container">
        {nivel !== "empleado" && (
          <button className="btn-insertar" onClick={() => createNewTarea()}>
            NUEVA
          </button>
        )}
      </div>
      <div>Filtros</div>
      <select onChange={(event) => filterByClase(event)}>
        <option value="">TODOS</option>
        <option value="proyectos">DE PROYECTOS</option>
        <option value="servicios">DE SERVICIOS</option>
        <option value="backloads">NO VINCULADAS</option>
      </select>

      <select
        name="empleados"
        id="empleados"
        onChange={(event) => filterByEmpleado(event)}
      >
        <option value={""}>TODOS</option>
        {empleados.map((element, index) => {
          return (
            <option key={index} value={`${element.nombre} ${element.apellido}`}>
              {element.nombre} {element.apellido}
            </option>
          );
        })}
      </select>

      <table className="content-table">
        <thead>
          <tr>
            <th>Clase</th>
            <th>Titulo</th>
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
            if (element.id_proyecto == null && element.id_servicio == null) {
              element.clase = "backload";
            } else if (element.id_proyecto !== null) {
              element.clase = "proyecto";
            } else {
              element.clase = "servicio";
            }
            return (
              <tr key={index}>
                <td onClick={() => viewTarea(element)}>{element.clase}</td>
                <td onClick={() => viewTarea(element)}>{element.titulo}</td>

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
      {viewInsertTarea && (
        <div className="modal-container">
          <div className="modal">
            <form
              className="form-container"
              method="get"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="text"
                id="titulo"
                placeholder="Titulo"
                {...register("titulo", {
                  required: true,
                })}
              />
              {errors.titulo?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <ReactQuill
                theme="snow"
                onChange={setValue}
                className="editor-input"
                modules={modules}
              />

              {/*   <textarea
                className="descripcion-input"
                id="descripcion"
                placeholder="Descripcion"
              />
              {errors2.descripcion?.type === "required" && (
                <span>Campo requerido</span>
              )} */}
              <label>Usuario Asignado</label>
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
              <label>Fecha Final</label>
              <input
                type="date"
                id="fecha_final"
                {...register("fecha_final", {
                  required: true,
                })}
              />
              {errors.fecha_final?.type === "required" && (
                <span>Campo requerido</span>
              )}
              <label>Prioridad</label>
              <select
                name="prioridad"
                id="prioridad"
                {...register("prioridad", {
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
                {...register("estado", {
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
                    reset();
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

export default Tareas;
