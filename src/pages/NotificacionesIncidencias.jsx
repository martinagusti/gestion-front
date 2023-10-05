import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./notificacionesIncidencias.css";

import { AuthContext } from "../context/AuthContext";

function NotificacionesIncidencias({
  incidencias,
  proyectos,
  clientes,
  setIncidencias,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const user = JSON.parse(localStorage.getItem("gestionUser"));

  const navigateTo = useNavigate();

  incidencias.sort((a, b) => {
    return b.id - a.id;
  });

  console.log(incidencias);

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
              <th>Comentario</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {incidencias.map((element, index) => {
              const fecha = new Date(element.fecha);
              return (
                <tr key={index}>
                  <td>{element.cliente_nombre}</td>
                  <td>{element.proyecto_nombre}</td>
                  <td>{element.etiqueta_nombre}</td>
                  <td>{element.comentario}</td>
                  <td>{element.estado}</td>
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

export default NotificacionesIncidencias;
