import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getClientes } from "../services/clientesService";
import { getEtiquetas, getIncidencias } from "../services";

const useIncidencias = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadIncidencias = async () => {
        try {
          setLoading(true);
          const data = await getIncidencias();
          setIncidencias(data);
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadIncidencias();
    }
  }, [token]);

  return {
    incidencias,
    setIncidencias,
    loading,
    error,
  };
};

export default useIncidencias;
