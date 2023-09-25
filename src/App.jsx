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

function App() {
  const { setToken, setUser, token } = useContext(AuthContext);
  const { nivel, loading, error } = useNivel();
  const { empleados, setEmpleados } = useEmpleados();
  const { clientes, setClientes } = useClientes();
  const { etiquetas, setEtiquetas } = useEtiquetas();
  const { proyectos, setProyectos } = useProyectos();
  const { incidencias, setIncidencias } = useIncidencias();
  const { tareas, setTareas } = useTareas();

  const [idProyecto, setIdProyecto] = useState();
  const [empleadosAsignados, setEmpleadosAsignados] = useState();

  return (
    <>
      <div className="app-container">
        <Header />
        {token && <SideBar nivel={nivel} />}
        {!token && <Login />}
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
              <Incidencias incidencias={incidencias} proyectos={proyectos} />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
