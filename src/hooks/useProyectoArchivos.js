import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getArchivos } from "../services/tareasService";
import { getProyectoArchivos } from "../services";

const useProyectoArchivos = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [proyectoArchivos, setProyectoArchivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadProyectoArchivos = async () => {
        try {
          setLoading(true);
          const data = await getProyectoArchivos();

          setProyectoArchivos(data);
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadProyectoArchivos();
    }
  }, [token]);

  return {
    proyectoArchivos,
    setProyectoArchivos,
    loading,
    error,
  };
};

export default useProyectoArchivos;
