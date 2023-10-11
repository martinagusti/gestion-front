import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getArchivos } from "../services/tareasService";
import { getMensajeArchivos, getServiciosArchivos } from "../services";

const useArchivos = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [archivos, setArchivos] = useState([]);
  const [mensajesArchivos, setMensajesArchivos] = useState([]);
  const [serviciosArchivos, setServiciosArchivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadArchivos = async () => {
        try {
          setLoading(true);
          const data = await getArchivos();
          const data2 = await getMensajeArchivos();
          const serviciosFiles = await getServiciosArchivos();
          setMensajesArchivos(data2);
          setArchivos(data);
          setServiciosArchivos(serviciosFiles);
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadArchivos();
    }
  }, [token]);

  return {
    archivos,
    setArchivos,
    mensajesArchivos,
    setMensajesArchivos,
    serviciosArchivos,
    setServiciosArchivos,
    loading,
    error,
  };
};

export default useArchivos;
