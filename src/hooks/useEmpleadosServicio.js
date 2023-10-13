import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getEmpleadosServicios } from "../services";

const useEmpleadosServicio = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [empleadosServicio, setEmpleadosServicio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadEmpleadosServicio = async () => {
        try {
          setLoading(true);
          const data = await getEmpleadosServicios();
          setEmpleadosServicio(data);
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadEmpleadosServicio();
    }
  }, [token]);

  return {
    empleadosServicio,
    setEmpleadosServicio,
    loading,
    error,
  };
};

export default useEmpleadosServicio;
