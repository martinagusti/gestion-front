import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getEmpleados } from "../services";

const useEmpleados = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadEmpleados = async () => {
        try {
          setLoading(true);
          const data = await getEmpleados();
          setEmpleados(data);
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadEmpleados();
    }
  }, [token]);

  return {
    empleados,
    setEmpleados,
    loading,
    error,
  };
};

export default useEmpleados;
