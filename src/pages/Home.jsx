import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./home.css";

import { AuthContext } from "../context/AuthContext";

function Home({ page, setPage, nivel, proyectos }) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const navigateTo = useNavigate();

  const user = JSON.parse(localStorage.getItem("gestionUser"));

  const misProyectos = proyectos.filter((element) => {
    return element.email_1 == user.email;
  });

  if (misProyectos.length == 0) {
    return <div>Aun no tienes Proyectos asociados</div>;
  }

  return (
    <div className="home-container">
      {nivel == "cliente" && (
        <button
          onClick={() => {
            navigateTo("/incidencias");
            setPage("INCIDENCIAS");
          }}
        >
          INCIDENCIAS
        </button>
      )}
    </div>
  );
}

export default Home;
