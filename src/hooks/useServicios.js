import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getServicios, getServiciosByIdEmpleado } from "../services";

const useServicios = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));

    if (user) {
      const loadServicios = async () => {
        try {
          setLoading(true);
          if (user.nivel === "empleado") {
            const data = await getServiciosByIdEmpleado(user.id);
            setServicios(data);
          } else {
            const data = await getServicios();
            setServicios(data);
          }
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadServicios();
    }
  }, [token]);

  return {
    servicios,
    setServicios,
    loading,
    error,
  };
};

export default useServicios;
