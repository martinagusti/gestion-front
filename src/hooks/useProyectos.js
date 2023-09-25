import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getClientes } from "../services/clientesService";
import { getEtiquetas, getProyectos, getProyectosById } from "../services";

const useProyectos = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));

    if (user) {
      const loadProyectos = async () => {
        try {
          setLoading(true);
          if (user.nivel === "empleado") {
            const data = await getProyectosById(user.id);
            setProyectos(data);
          } else {
            const data = await getProyectos();
            setProyectos(data);
          }
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadProyectos();
    }
  }, [token]);

  return {
    proyectos,
    setProyectos,
    loading,
    error,
  };
};

export default useProyectos;
