import { Route, Routes } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import "./App.css";
import Header from "./components/header/Header";
import Login from "./pages/Login";
import { AuthContext } from "./context/AuthContext";
import SideBar from "./components/sidebar/SideBar";
import Empleados from "./pages/Empleados";
import Clientes from "./pages/Clientes";
import Proyectos from "./pages/Proyectos";
import useNivel from "./hooks/useNivel";
import useEmpleados from "./hooks/useEmpleados";
import useClientes from "./hooks/useClientes";
import Etiquetas from "./pages/Etiquetas";
import useEtiquetas from "./hooks/useEtiquetas";
import useProyectos from "./hooks/useProyectos";
import ProyectoDetalle from "./pages/ProyectoDetalle";
import { getProyectosByIdProyecto } from "./services";
import useIncidencias from "./hooks/useIncidencias";
import Incidencias from "./pages/Incidencias";
import useTareas from "./hooks/useTareas";
import useArchivos from "./hooks/useArchivos";
import useProyectoArchivos from "./hooks/useProyectoArchivos";
import { useNavigate } from "react-router-dom";
import NotificacionesIncidencias from "./pages/NotificacionesIncidencias";
import IncidenciaMensajes from "./pages/IncidenciaMensajes";
import Home from "./pages/Home";
import useEmpleadosProyecto from "./hooks/useEmpleadosProyecto";
import useServicios from "./hooks/useServicios";
import Servicios from "./pages/Servicios";
import ServicioDetalle from "./pages/ServicioDetalle";
import useEmpleadosServicio from "./hooks/useEmpleadosServicio";
import TareaDetalle from "./pages/TareaDetalle";
import Tareas from "./pages/Tareas";

function App() {
  const { setToken, setUser, token } = useContext(AuthContext);
  const { nivel, loading, error } = useNivel();
  const { empleados, setEmpleados } = useEmpleados();
  const { clientes, setClientes } = useClientes();
  const { etiquetas, setEtiquetas } = useEtiquetas();
  const { proyectos, setProyectos } = useProyectos();
  const { servicios, setServicios } = useServicios();
  const { incidencias, setIncidencias, mensajes, setMensajes } =
    useIncidencias();
  const { tareas, setTareas } = useTareas();
  const {
    archivos,
    setArchivos,
    mensajesArchivos,
    setMensajesArchivos,
    serviciosArchivos,
    setServiciosArchivos,
  } = useArchivos();
  const { proyectoArchivos, setProyectoArchivos } = useProyectoArchivos();
  const { empleadosProyecto, setEmpleadosProyecto } = useEmpleadosProyecto();
  const { empleadosServicio, setEmpleadosServicio } = useEmpleadosServicio();

  const [idProyecto, setIdProyecto] = useState();
  const [idServicio, setIdServicio] = useState();
  const [empleadosAsignados, setEmpleadosAsignados] = useState();
  const [empleadosAsignadosByServicio, setEmpleadosAsignadosByServicio] =
    useState();
  const [idIncidencia, setIdIncidencia] = useState();

  const [page, setPage] = useState();
  const [tareaId, setTareaId] = useState();

  const navigateTo = useNavigate();

  const user = JSON.parse(localStorage.getItem("gestionUser"));

  return (
    <>
      <div className="app-container">
        <Header page={page} />
        {token && <SideBar nivel={nivel} setPage={setPage} />}
        {!token && page !== "LOGIN" && <Login setPage={setPage} page={page} />}
        <Routes>
          <Route
            path="/login"
            element={<Login setPage={setPage} page={page} />}
          />
          <Route
            path="/empleados"
            element={
              <Empleados empleados={empleados} setEmpleados={setEmpleados} />
            }
          />
          <Route
            path="/clientes"
            element={
              <Clientes
                clientes={clientes}
                setClientes={setClientes}
                nivel={nivel}
                proyectos={proyectos}
                empleados={empleados}
                setEmpleados={setEmpleados}
              />
            }
          />
          <Route
            path="/etiquetas"
            element={
              <Etiquetas
                etiquetas={etiquetas}
                setEtiquetas={setEtiquetas}
                nivel={nivel}
              />
            }
          />
          <Route
            path="/proyectos"
            element={
              <Proyectos
                proyectos={proyectos}
                setProyectos={setProyectos}
                nivel={nivel}
                idProyecto={idProyecto}
                setIdProyecto={setIdProyecto}
                clientes={clientes}
                etiquetas={etiquetas}
                empleadosAsignados={empleadosAsignados}
                setEmpleadosAsignados={setEmpleadosAsignados}
                empleados={empleados}
              />
            }
          />

          <Route
            path="/proyectoDetalle"
            element={
              <ProyectoDetalle
                archivos={archivos}
                setArchivos={setArchivos}
                proyectoArchivos={proyectoArchivos}
                setProyectoArchivos={setProyectoArchivos}
                setTareas={setTareas}
                tareas={tareas}
                tareaId={tareaId}
                setTareaId={setTareaId}
                proyectos={proyectos}
                setProyectos={setProyectos}
                nivel={nivel}
                idProyecto={idProyecto}
                empleadosAsignados={empleadosAsignados}
                setEmpleadosAsignados={setEmpleadosAsignados}
                empleados={empleados}
                etiquetas={etiquetas}
                incidencias={incidencias}
              />
            }
          />
          <Route
            path="/incidencias"
            element={
              <Incidencias
                incidencias={incidencias}
                setIncidencias={setIncidencias}
                proyectos={proyectos}
                clientes={clientes}
                mensajes={mensajes}
                setMensajes={setMensajes}
                idIncidencia={idIncidencia}
                setIdIncidencia={setIdIncidencia}
                setPage={setPage}
                page={page}
              />
            }
          />
          <Route
            path="/notificaciones"
            element={
              <NotificacionesIncidencias
                incidencias={incidencias}
                setIncidencias={setIncidencias}
                proyectos={proyectos}
                clientes={clientes}
                idIncidencia={idIncidencia}
                empleadosProyecto={empleadosProyecto}
                setIdIncidencia={setIdIncidencia}
                mensajes={mensajes}
                setMensajes={setMensajes}
                nivel={nivel}
              />
            }
          />

          <Route
            path="/incidencias/mensajes"
            element={
              <IncidenciaMensajes
                mensajes={mensajes}
                setMensajes={setMensajes}
                idIncidencia={idIncidencia}
                nivel={nivel}
                mensajesArchivos={mensajesArchivos}
                setMensajesArchivos={setMensajesArchivos}
              />
            }
          />
          <Route
            path="/"
            element={
              <Home
                nivel={nivel}
                proyectos={proyectos}
                setPage={setPage}
                page={page}
              />
            }
          />

          <Route
            path="/tareaDetalle"
            element={
              <TareaDetalle
                tareaId={tareaId}
                tareas={tareas}
                archivos={archivos}
                setTareas={setTareas}
                nivel={nivel}
                empleados={empleados}
              />
            }
          />

          <Route
            path="/tareas"
            element={
              <Tareas
                tareas={tareas}
                nivel={nivel}
                setTareas={setTareas}
                tareaId={tareaId}
                setTareaId={setTareaId}
                empleados={empleados}
              />
            }
          />

          <Route
            path="/servicios"
            element={
              <Servicios
                servicios={servicios}
                setServicios={setServicios}
                nivel={nivel}
                empleados={empleados}
                etiquetas={etiquetas}
                clientes={clientes}
                setIdServicio={setIdServicio}
                empleadosAsignadosByServicio={empleadosAsignadosByServicio}
                setEmpleadosAsignadosByServicio={
                  setEmpleadosAsignadosByServicio
                }
              />
            }
          />

          <Route
            path="/servicioDetalle"
            element={
              <ServicioDetalle
                serviciosArchivos={serviciosArchivos}
                setServiciosArchivos={setServiciosArchivos}
                archivos={archivos}
                setArchivos={setArchivos}
                servicios={servicios}
                setServicios={setServicios}
                nivel={nivel}
                setTareas={setTareas}
                tareas={tareas}
                tareaId={tareaId}
                setTareaId={setTareaId}
                idServicio={idServicio}
                empleados={empleados}
                empleadosAsignados={empleadosAsignados}
                setEmpleadosAsignados={setEmpleadosAsignados}
                clientes={clientes}
                etiquetas={etiquetas}
                incidencias={incidencias}
                empleadosAsignadosByServicio={empleadosAsignadosByServicio}
                setEmpleadosAsignadosByServicio={
                  setEmpleadosAsignadosByServicio
                }
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
