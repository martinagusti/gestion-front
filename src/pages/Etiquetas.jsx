import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./etiquetas.css";

import { AuthContext } from "../context/AuthContext";
import { createEtiqueta, deleteEtiqueta } from "../services";

function Etiquetas({ etiquetas, setEtiquetas, nivel }) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const [viewInsertEtiqueta, setViewInsertEtiqueta] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [idDelete, setIdDelete] = useState();

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
    const { nombre } = data;

    try {
      const created = await createEtiqueta(nombre);

      setEtiquetas([created[0], ...etiquetas]);
      reset();
      setViewInsertEtiqueta(false);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const deleteEtiquetaFunction = (element) => {
    setIdDelete(element.id);
    setEliminando(true);
  };

  const confirmDelete = async () => {
    try {
      const deleted = await deleteEtiqueta(idDelete);
      if (deleted) {
        setEtiquetas(
          etiquetas.filter((element) => {
            return element.id != idDelete;
          })
        );
        setErrorText(null);
        setEliminando(false);
      }
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  return (
    <div className="etiquetas-container">
      {nivel !== "empleado" && (
        <button
          onClick={() => {
            setViewInsertEtiqueta(true);
          }}
        >
          CREAR ETIQUETA
        </button>
      )}
      <div className="etiquetas-contenedor">
        {etiquetas.map((element, index) => {
          return (
            <div className="etiqueta" key={index}>
              {nivel !== "empleado" && (
                <div
                  className="delete-etiqueta"
                  onClick={() => deleteEtiquetaFunction(element)}
                >
                  X
                </div>
              )}
              <h1>{element.nombre}</h1>
            </div>
          );
        })}
      </div>

      {viewInsertEtiqueta && (
        <div className="etiqueta-create-modal-container">
          <div className="etiqueta-create-modal">
            <form
              className="etiqueta-form-container"
              method="post"
              onSubmit={handleSubmit(onSubmit)}
            >
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

              <div className="modal-actions">
                <button type="submit">CREAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewInsertEtiqueta(false);
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

      {eliminando && (
        <div className="modal-container">
          <div className="modal">
            <label>Seguro desea eliminar la etiqueta? </label>

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
                  setEliminando(false);
                  setErrorText(null);
                }}
              >
                CANCELAR
              </button>
            </div>
            {errorText && <span>{errorText}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Etiquetas;
