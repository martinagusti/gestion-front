import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./incidenciaMensajes.css";

import { AuthContext } from "../context/AuthContext";
import { createIncidencia, createIncidenciaMensaje } from "../services";
import Incidencias from "./Incidencias";

function IncidenciaMensajes({ mensajes, setMensajes, idIncidencia, nivel }) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const user = JSON.parse(localStorage.getItem("gestionUser"));

  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const { mensaje } = data;

    try {
      const created = await createIncidenciaMensaje(
        idIncidencia,
        nivel == "cliente" ? user.nombre : "Online Valles",
        mensaje
      );

      console.log(created);
      const fech = new Date(created[0].fecha);
      console.log(fech.getHours());

      setMensajes([created[0], ...mensajes]);
      setErrorText(null);
      reset();
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  let mensajesIncidencia = mensajes.filter((element) => {
    return element.id_incidencia == idIncidencia;
  });

  mensajes.sort((a, b) => {
    return b.id - a.id;
  });

  return (
    <div className="incidenciasMensajes-container">
      {nivel == "cliente" && (
        <div>
          <button onClick={() => navigateTo("/incidencias")}>VOLVER</button>
        </div>
      )}
      <div className="mensajes-container">
        {mensajesIncidencia.map((element, index) => {
          const fecha = new Date(element.fecha);
          let pad = fecha.getMinutes() + "";
          pad.padStart(2, "0");

          return (
            <div key={index} className="mensaje">
              <div className="asunto">
                {" "}
                {`${fecha.getDate()}/${
                  fecha.getMonth() + 1
                }/${fecha.getFullYear()} ${fecha.getHours()}:${pad.padStart(
                  2,
                  "0"
                )} ${element.remitente}`}
              </div>
              <div className="mensaje-container">
                <div className="texto">{element.mensaje}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="envio-mensaje-container">
        <label>ENVIAR UN MENSAJE</label>
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <textarea
            id="mensaje"
            placeholder="Mensaje"
            className="incidencia-mensaje-input"
            {...register("mensaje", {
              required: true,
            })}
          />
          {errors.mensaje?.type === "required" && <span>Campo requerido</span>}

          <div className="modal-actions">
            <button type="submit">ENVIAR</button>
          </div>
          {errorText && <span>{errorText}</span>}
        </form>
      </div>
    </div>
  );
}

export default IncidenciaMensajes;
