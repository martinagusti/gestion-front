import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./notificacionesIncidencias.css";

import { AuthContext } from "../context/AuthContext";
import {
  getIncidencias,
  getProyectosByIdProyecto,
  updateIncidencia,
} from "../services";

function NotificacionesIncidencias({
  incidencias,
  proyectos,
  clientes,
  setIncidencias,
  empleadosProyecto,
  idIncidencia,
  setIdIncidencia,
  mensajes,
  setMensajes,
  nivel,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const user = JSON.parse(localStorage.getItem("gestionUser"));

  const navigateTo = useNavigate();

  incidencias.sort((a, b) => {
    return b.id - a.id;
  });

  if (nivel == "empleado") {
    incidencias = incidencias.filter((element) => {
      return element.id_empleado == user.id;
    });
  }

  const asignarEmpleado = async (e, element) => {
    console.log(e.target);
    console.log(element);
    if (e.target.name == "estado") {
      try {
        const updated = await updateIncidencia(
          element.id,
          element.id_empleado,
          e.target.value
        );
        const todas = await getIncidencias();
        setIncidencias(todas);
      } catch (error) {
        console.log(error);
        setErrorText(error.response.data.error);
      }
    } else {
      if (e.target.value !== "") {
        try {
          const updated = await updateIncidencia(
            element.id,
            e.target.value,
            element.estado
          );
          const todas = await getIncidencias();
          setIncidencias(todas);
        } catch (error) {
          console.log(error);
          setErrorText(error.response.data.error);
        }
      }
    }
  };

  const incidenciaMensajes = (element) => {
    console.log("entre");
    setIdIncidencia(element.id);
    navigateTo("/incidencias/mensajes");
  };

  const edit = (element) => {
    console.log(element);
  };

  return (
    <div className="notificacionesIncidencias-container">
      <div className="box-table-content">
        <div> Crear Filtros por cliente, proyecto, etiqueta, estado</div>
        <table className="content-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Proyecto</th>
              <th>Etiqueta</th>
              <th>Asunto</th>
              <th>Estado</th>
              <th>Mensajes</th>
              <th>Fecha</th>
              {nivel !== "empleado" && <th>Asignar a:</th>}
            </tr>
          </thead>

          <tbody>
            {incidencias.map((element, index) => {
              const fecha = new Date(element.fecha);
              const empleadosByProyecto = empleadosProyecto.filter((item) => {
                return item.id_proyecto == element.id_proyecto;
              });
              const cantidadMensajes = mensajes.filter((mensaje) => {
                return mensaje.id_incidencia == element.id;
              });

              return (
                <tr key={index}>
                  <td onClick={() => incidenciaMensajes(element)}>
                    {element.cliente_nombre}
                  </td>
                  <td onClick={() => incidenciaMensajes(element)}>
                    {element.proyecto_nombre}
                  </td>
                  <td onClick={() => incidenciaMensajes(element)}>
                    {element.etiqueta_nombre}
                  </td>
                  <td onClick={() => incidenciaMensajes(element)}>
                    {element.comentario}
                  </td>
                  <td
                    className={
                      element.estado == "resuelta"
                        ? "select-estado-resuelta"
                        : element.estado == "en proceso"
                        ? "select-estado-enproceso"
                        : "select-estado"
                    }
                  >
                    <select
                      defaultValue={element.estado}
                      onChange={(e) => asignarEmpleado(e, element)}
                      name="estado"
                      className={
                        element.estado == "resuelta"
                          ? "select-estado-resuelta"
                          : element.estado == "en proceso"
                          ? "select-estado-enproceso"
                          : "select-estado"
                      }
                    >
                      <option value="pendiente">pendiente</option>
                      <option value="en proceso">en proceso</option>
                      <option value="resuelta">resuelta</option>
                    </select>
                  </td>
                  <td onClick={() => incidenciaMensajes(element)}>
                    {cantidadMensajes.length}
                  </td>
                  <td
                    onClick={() => incidenciaMensajes(element)}
                  >{`${fecha.getDate()}/${
                    fecha.getMonth() + 1
                  }/${fecha.getFullYear()}`}</td>

                  {nivel !== "empleado" && (
                    <td>
                      <select
                        defaultValue={element.id_empleado}
                        className="select-empleado"
                        onChange={(e) => asignarEmpleado(e, element)}
                      >
                        {empleadosByProyecto.map((element, index) => {
                          return (
                            <option key={index} value={element.id_empleado}>
                              {element.nombre} {element.apellido}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotificacionesIncidencias;
