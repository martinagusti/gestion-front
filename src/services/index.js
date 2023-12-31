import axios from "axios";

import { login } from "./authService";
import {
  createEmpleado,
  getEmpleados,
  editEmpleado,
  deleteEmpleado,
  getEmpleadosProyectos,
  getEmpleadosServicios,
} from "./empleadosService";

import { createCliente, deleteCliente, editCliente } from "./clientesService";

import {
  getEtiquetas,
  createEtiqueta,
  deleteEtiqueta,
} from "./etiquetasService";

import {
  getProyectos,
  getProyectosById,
  getProyectosByIdProyecto,
  getProyectosByIdCliente,
  getProyectosByIdEtiqueta,
  createProyecto,
  deleteEmpleadoAsignado,
  deleteProyecto,
  editProyecto,
  getProyectoArchivos,
  deleteProyectoArchivo,
} from "./proyectosService";

import {
  getServicios,
  getServiciosByIdEmpleado,
  getEmpleadosByIdServicio,
  createServicio,
  deleteServicio,
  editServicio,
  getServiciosArchivos,
  deleteServicioArchivo,
  createEmpleadoAsignadoByServicio,
  deleteEmpleadoAsignadoByServicio,
} from "./serviciosService";

import {
  getIncidencias,
  createIncidencia,
  getIncidenciasMensajes,
  createIncidenciaMensaje,
  updateIncidencia,
  getMensajeArchivos,
} from "./incidenciasService";

import {
  getTareas,
  createTarea,
  deleteTarea,
  getArchivos,
  deleteTareaArchivo,
  editTarea,
} from "./tareasService";

const isBearerTokenRequired = (url) => {
  const parsedUrl = new URL(url);
  const publicRoutes = ["/users/login", "/users"];

  if (publicRoutes.includes(parsedUrl.pathname)) {
    return false;
  } else {
    return true;
  }
};

axios.interceptors.request.use(
  function (config) {
    const token = JSON.parse(localStorage.getItem("peixateriaToken"));

    if (token && isBearerTokenRequired(config.url)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    //arreglar aqui
    /*   if(response.data){
        //arreglar aqui
            localStorage.setItem("currentUser", JSON.stringify(response.data))
        } */
    return response;
  },
  function (error) {
    console.log(error);
    if (error.response.request.status === 403) {
      console.log("Usuario o contraseña incorrecto");
    }

    return Promise.reject(error);
  }
);

export {
  login,
  createEmpleado,
  getEmpleados,
  editEmpleado,
  deleteEmpleado,
  createCliente,
  deleteCliente,
  editCliente,
  getEtiquetas,
  createEtiqueta,
  deleteEtiqueta,
  getProyectos,
  getProyectosById,
  getProyectosByIdProyecto,
  getProyectosByIdCliente,
  getProyectosByIdEtiqueta,
  createProyecto,
  deleteEmpleadoAsignado,
  deleteProyecto,
  editProyecto,
  getIncidencias,
  createIncidencia,
  getIncidenciasMensajes,
  getMensajeArchivos,
  getTareas,
  createTarea,
  deleteTarea,
  editTarea,
  getArchivos,
  deleteTareaArchivo,
  getProyectoArchivos,
  deleteProyectoArchivo,
  createIncidenciaMensaje,
  getEmpleadosProyectos,
  getEmpleadosServicios,
  createEmpleadoAsignadoByServicio,
  updateIncidencia,
  getServicios,
  getServiciosByIdEmpleado,
  getEmpleadosByIdServicio,
  createServicio,
  deleteServicio,
  editServicio,
  getServiciosArchivos,
  deleteServicioArchivo,
  deleteEmpleadoAsignadoByServicio,
};
