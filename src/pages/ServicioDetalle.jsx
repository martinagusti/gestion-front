import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./servicioDetalle.css";

import { AuthContext } from "../context/AuthContext";

function ServicioDetalle({
  servicios,
  setServicios,
  nivel,
  empleados,
  etiquetas,
  setIdServicio,
  setEmpleadosAsignadosByServicio,
  idServicio,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const navigateTo = useNavigate();

  servicios = servicios.filter((element) => {
    return element.id === idServicio;
  });

  console.log(servicios);

  return <div className="serviciosDetalle-container"></div>;
}

export default ServicioDetalle;
