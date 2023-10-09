import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./incidencias.css";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { createIncidencia } from "../services";

function Incidencias({
  incidencias,
  proyectos,
  clientes,
  setIncidencias,
  mensajes,
  setMensajes,
  idIncidencia,
  setIdIncidencia,
  page,
  setPage,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const user = JSON.parse(localStorage.getItem("gestionUser"));

  const navigateTo = useNavigate();

  clientes = clientes.filter((element) => {
    return element.email_1 == user.email;
  });

  incidencias = incidencias.filter((element) => {
    return element.id_cliente == clientes[0].id;
  });

  incidencias.sort((a, b) => {
    return b.id - a.id;
  });

  proyectos = proyectos.filter((element) => {
    return element.email_1 == user.email;
  });

  incidencias.map((element) => {
    element.proyecto_nombre = proyectos.filter((proyecto) => {
      return proyecto.id == element.id_proyecto;
    })[0]?.nombre;
  });

  const logout = () => {
    localStorage.removeItem("gestionUser");
    setToken(null);
    setPage("LOGIN");
    navigateTo("/login");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    console.log(data);
    let { nombre, empresa, telefono, email, comentario, id_proyecto } = data;

    const id_cliente = clientes[0].id;
    id_proyecto = parseInt(id_proyecto);

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

      const proyecto_nombre = proyectos.filter((element) => {
        return element.id == id_proyecto;
      });

      created[0].proyecto_nombre = proyecto_nombre[0].nombre;
      setIncidencias([created[0], ...incidencias]);

      reset();

      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const incidenciaMensajes = (element) => {
    setIdIncidencia(element.id);
    navigateTo("/incidencias/mensajes");
  };

  return (
    <div className="incidencias-container">
      <div className="btn-insertar-container">
        <button className="btn-insertar" onClick={() => logout()}>
          LOGOUT
        </button>
      </div>

      <div className="envio-incidencia">
        <form
          className="form-container"
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
            <option value="">Seleccionar Proyecto/Servicio</option>
            {proyectos.map((element, index) => {
              return (
                <option key={index} value={element.id}>
                  {element.nombre}
                </option>
              );
            })}
          </select>
          {errors.id_proyecto?.type === "required" && (
            <span>Campo requerido</span>
          )}
          <input
            type="text"
            id="nombre"
            placeholder="Nombre"
            defaultValue={clientes[0]?.nombre}
            {...register("nombre", {
              required: true,
            })}
          />
          {errors.nombre?.type === "required" && <span>Campo requerido</span>}

          <input
            type="text"
            id="empresa"
            placeholder="Empresa"
            defaultValue={clientes[0]?.razon_social}
            {...register("empresa", {
              required: true,
            })}
          />
          {errors.empresa?.type === "required" && <span>Campo requerido</span>}
          <input
            type="text"
            id="telefono"
            placeholder="Telefono"
            defaultValue={clientes[0]?.telefono_1}
            {...register("telefono", {
              required: true,
            })}
          />
          {errors.telefono?.type === "required" && <span>Campo requerido</span>}

          <input
            type="text"
            placeholder="Email"
            defaultValue={clientes[0]?.email_1}
            {...register("email", {
              required: true,
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
          />

          {errors.email?.type === "required" && <span>Campo requerido</span>}
          {errors.email?.type === "pattern" && <span>Email no es valido</span>}

          <textarea
            className="comentarios-input"
            type="text"
            placeholder="Asunto"
            id="comentario"
            {...register("comentario", {
              required: true,
            })}
          />
          {errors.comentario?.type === "required" && (
            <span>Campo requerido</span>
          )}

          <div className="modal-actions">
            <button type="submit">ENVIAR</button>
          </div>
          {errorText && <span>{errorText}</span>}
        </form>
      </div>

      <div className="box-table-content">
        <table className="content-table">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Asunto</th>
              <th>Estado</th>
              <th>Mensajes</th>
              <th>Fecha</th>
            </tr>
          </thead>

          <tbody>
            {incidencias.map((element, index) => {
              const fecha = new Date(element.fecha);
              const cantidadMensajes = mensajes.filter((mensaje) => {
                return mensaje.id_incidencia == element.id;
              });

              return (
                <tr
                  key={index}
                  className="row"
                  onClick={() => incidenciaMensajes(element)}
                >
                  <td>{element.proyecto_nombre}</td>
                  <td>{element.comentario}</td>
                  <td>{element.estado}</td>
                  <td>{cantidadMensajes.length}</td>
                  <td>{`${fecha.getDate()}/${
                    fecha.getMonth() + 1
                  }/${fecha.getFullYear()}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Incidencias;
