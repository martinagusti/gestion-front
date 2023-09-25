import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./incidencias.css";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { createIncidencia } from "../services";

function Incidencias({ incidencias, proyectos }) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const navigateTo = useNavigate();

  proyectos = proyectos.filter((element) => {
    return element.id_cliente == 16;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    console.log(data);
    const { nombre, empresa, telefono, email, comentario, id_proyecto } = data;

    const id_cliente = 16;

    try {
      const created = await createIncidencia(
        id_proyecto,
        id_cliente,
        comentario,
        email,
        nombre,
        empresa,
        telefono
      );

      console.log(created[0]);

      reset();

      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  return (
    <div className="incidencias-container">
      <h1>Incidencias Page</h1>
      <form
        className="empleado-form-container"
        method="post"
        onSubmit={handleSubmit(onSubmit)}
      >
        <select
          name="id_proyecto"
          id="id_proyecto"
          {...register("id_proyecto", {
            required: true,
          })}
        >
          <option value="">Seleccionar</option>
          {proyectos.map((element, index) => {
            return (
              <option key={index} value={element.id}>
                {element.nombre}
              </option>
            );
          })}
        </select>
        <input
          type="text"
          id="nombre"
          placeholder="Nombre"
          {...register("nombre", {
            required: true,
          })}
        />
        {errors.nombre?.type === "required" && <span>Campo requerido</span>}

        <input
          type="text"
          id="empresa"
          placeholder="Empresa"
          {...register("empresa", {
            required: true,
          })}
        />
        {errors.empresa?.type === "required" && <span>Campo requerido</span>}
        <input
          type="text"
          id="telefono"
          placeholder="Telefono"
          {...register("telefono", {
            required: true,
          })}
        />
        {errors.telefono?.type === "required" && <span>Campo requerido</span>}

        <input
          type="text"
          placeholder="Email"
          {...register("email", {
            required: true,
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
        />

        {errors.email?.type === "required" && <span>Campo requerido</span>}
        {errors.email?.type === "pattern" && <span>Email no es valido</span>}

        <input
          type="text"
          id="comentario"
          placeholder="Comentario"
          {...register("comentario", {
            required: true,
          })}
        />
        {errors.comentario?.type === "required" && <span>Campo requerido</span>}

        <div className="modal-actions">
          <button type="submit">ENVIAR</button>
        </div>
        {errorText && <span>{errorText}</span>}
      </form>
    </div>
  );
}

export default Incidencias;
