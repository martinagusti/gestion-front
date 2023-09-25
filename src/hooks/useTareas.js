import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTareas } from "../services/tareasService";

const useTareas = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadTareas = async () => {
        try {
          setLoading(true);
          const data = await getTareas();
          setTareas(data);
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadTareas();
    }
  }, [token]);

  return {
    tareas,
    setTareas,
    loading,
    error,
  };
};

export default useTareas;
