import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./sideBar.css";
import { AuthContext } from "../../context/AuthContext";

function SideBar({ nivel, page, setPage }) {
  const navigateTo = useNavigate();
  const { setToken, setUser, token } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("gestionUser");
    setToken(null);
    navigateTo("/");
  };

  return (
    <div className="sideBar-container">
      {nivel === "administrador" && (
        <div
          className="empleados tooltip"
          onClick={() => {
            setPage("EMPLEADOS");
            navigateTo("/empleados");
          }}
        >
          <span className="tooltip-box">Empleados</span>
        </div>
      )}
      <div
        className="clientes tooltip"
        onClick={() => {
          setPage("CLIENTES");
          navigateTo("/clientes");
        }}
      >
        <span className="tooltip-box">Clientes</span>
      </div>

      <div
        className="etiquetas tooltip"
        onClick={() => {
          setPage("ETIQUETAS");
          navigateTo("/etiquetas");
        }}
      >
        <span className="tooltip-box">Etiquetas</span>
      </div>

      <div
        className="proyectos tooltip"
        onClick={() => {
          setPage("PROYECTOS");
          navigateTo("/proyectos");
        }}
      >
        <span className="tooltip-box">Proyectos</span>
      </div>

      <div
        className="incidencias tooltip"
        onClick={() => {
          setPage("INCIDENCIAS");
          navigateTo("/incidencias");
        }}
      >
        <span className="tooltip-box">Incidencias</span>
      </div>

      <div
        className="logout tooltip"
        onClick={() => {
          logout();
          setPage("LOGIN");
          navigateTo("/");
        }}
      >
        <span className="tooltip-box">Logout</span>
      </div>
    </div>
  );
}

export default SideBar;
