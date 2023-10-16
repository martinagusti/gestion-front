import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./tareaDetalle.css";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { deleteTarea, editTarea, getArchivos, getTareas } from "../services";

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

function TareaDetalle({
  tareaId,
  tareas,
  setTareas,
  archivos,
  nivel,
  empleados,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();
  const [viewDeleteTarea, setViewDeleteTarea] = useState(false);
  const [editando, setEditando] = useState(false);
  const [value, setValue] = useState();

  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const { titulo, empleado, fecha_inicio, fecha_final, prioridad, estado } =
      data;

    const id_empleado = parseInt(empleado);

    try {
      const created = await editTarea(
        tareaId,
        id_empleado,
        titulo,
        value,
        estado,
        prioridad,
        fecha_inicio,
        fecha_final
      );

      setTareas(await getTareas());
      reset();
      setEditando(false);
      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const tarea = tareas.filter((element) => {
    return element.id == tareaId;
  })[0];

  archivos = archivos.filter((element) => {
    return element.id_tarea == tareaId;
  });

  const deleteTareaFunction = async () => {
    try {
      const deleted = await deleteTarea(tareaId);

      if (deleted) {
        setTareas(
          tareas.filter((element) => {
            return element.id != tareaId;
          })
        );
        setErrorText(null);
        setViewDeleteTarea(false);
        navigateTo("/tareas");
      }

      setViewDeleteTarea(false);
      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const fechaInicio = new Date(tarea.fecha_comienzo);
  const fechaFinal = new Date(tarea.fecha_final);

  let dia = fechaInicio.getDate();
  if (dia < 10) {
    dia = `0${dia}`;
  }
  let mes = fechaInicio.getMonth() + 1;
  if (mes < 10) {
    mes = `0${mes}`;
  }

  let dia2 = fechaFinal.getDate();
  if (dia2 < 10) {
    dia2 = `0${dia2}`;
  }
  let mes2 = fechaFinal.getMonth() + 1;
  if (mes2 < 10) {
    mes2 = `0${mes2}`;
  }

  const fechaInicialToEdit = `${fechaInicio.getFullYear()}-${mes}-${dia}`;
  const fechaFinalToEdit = `${fechaFinal.getFullYear()}-${mes2}-${dia2}`;

  return (
    <div className="tareaDetalle-container">
      <div className="tareas-actions">
        {nivel !== "empleado" && (
          <div>
            <button onClick={() => setViewDeleteTarea(true)}>ELIMINAR</button>
            <button onClick={() => setEditando(true)}>EDITAR</button>
          </div>
        )}
      </div>
      <div className="servicio-info">
        <h3>Titulo: {tarea.titulo}</h3>
        <h3>
          Responsable: {tarea.nombre} {tarea.apellido}
        </h3>

        <h3>
          Fecha inicio: {fechaInicio.getDate()}/{fechaInicio.getMonth() + 1}/
          {fechaInicio.getFullYear()}
        </h3>
        <h3>
          Fecha final: {fechaFinal.getDate()}/{fechaFinal.getMonth() + 1}/
          {fechaFinal.getFullYear()}
        </h3>
        <h3>Estado: {tarea.estado}</h3>
        <h3>Prioridad: {tarea.prioridad}</h3>
        <div className="descripcion-servicio-container">
          <div
            className="texto"
            dangerouslySetInnerHTML={{ __html: tarea.descripcion }}
          ></div>
        </div>
        <label>ARCHIVOS</label>
        {archivos.map((element, index) => {
          return (
            <div key={index}>
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/tareasFiles/${
                  element.nombre
                }`}
                target="_blank"
                download="archivo.txt"
              >
                {element.nombre}
              </a>
            </div>
          );
        })}
      </div>
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

      {editando && (
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
                defaultValue={tarea.titulo}
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
                defaultValue={tarea.descripcion}
                modules={modules}
              />

              <label>Usuario Asignado</label>
              <select
                name="empleado"
                id="empleado"
                defaultValue={tarea.id_empleado}
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
                defaultValue={fechaInicialToEdit}
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
                defaultValue={fechaFinalToEdit}
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
                defaultValue={tarea.prioridad}
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
                defaultValue={tarea.estado}
                {...register("estado", {
                  required: true,
                })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en proceso">En Proceso</option>
                <option value="resuelta">Resuelta</option>
              </select>

              <div className="modal-actions">
                <button type="submit">GUARDAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setEditando(false);
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

export default TareaDetalle;
