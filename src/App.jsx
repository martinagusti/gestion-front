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

function App() {
  const { setToken, setUser, token } = useContext(AuthContext);
  const { nivel, loading, error } = useNivel();
  const { empleados, setEmpleados } = useEmpleados();
  const { clientes, setClientes } = useClientes();
  const { etiquetas, setEtiquetas } = useEtiquetas();
  const { proyectos, setProyectos } = useProyectos();
  const { incidencias, setIncidencias, mensajes, setMensajes } =
    useIncidencias();
  const { tareas, setTareas } = useTareas();
  const { archivos, setArchivos } = useArchivos();
  const { proyectoArchivos, setProyectoArchivos } = useProyectoArchivos();
  const { empleadosProyecto, setEmpleadosProyecto } = useEmpleadosProyecto();

  const [idProyecto, setIdProyecto] = useState();
  const [empleadosAsignados, setEmpleadosAsignados] = useState();
  const [idIncidencia, setIdIncidencia] = useState();

  const [page, setPage] = useState();

  const navigateTo = useNavigate();

  const user = JSON.parse(localStorage.getItem("gestionUser"));

  return (
    <>
      <div className="app-container">
        <Header page={page} />
        {token && <SideBar nivel={nivel} setPage={setPage} />}
        {!token && <Login setPage={setPage} page={page} />}
        <Routes>
          <Route path="/login" element={<Login />} />
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
              />
            }
          />
          <Route
            path="/"
            element={<Home nivel={nivel} proyectos={proyectos} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
