import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getClientes } from "../services/clientesService";
import { getEmpleadosProyectos, getEtiquetas } from "../services";

const useEmpleadosProyecto = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [empleadosProyecto, setEmpleadosProyecto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadEmpleadosProyecto = async () => {
        try {
          setLoading(true);
          const data = await getEmpleadosProyectos();
          setEmpleadosProyecto(data);
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadEmpleadosProyecto();
    }
  }, [token]);

  return {
    empleadosProyecto,
    setEmpleadosProyecto,
    loading,
    error,
  };
};

export default useEmpleadosProyecto;
