import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getClientes } from "../services/clientesService";

const useClientes = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadClientes = async () => {
        try {
          setLoading(true);
          const data = await getClientes();
          setClientes(data);
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadClientes();
    }
  }, [token]);

  return {
    clientes,
    setClientes,
    loading,
    error,
  };
};

export default useClientes;
