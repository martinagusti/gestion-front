import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getClientes } from "../services/clientesService";
import { getEtiquetas, getIncidencias } from "../services";
import { getIncidenciasMensajes } from "../services/incidenciasService";

const useIncidencias = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [incidencias, setIncidencias] = useState([]);
  const [mensajes, setMensajes] = useState([]);
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
          const mensajesIncidencias = await getIncidenciasMensajes();
          setMensajes(mensajesIncidencias);
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
    mensajes,
    setMensajes,
    loading,
    error,
  };
};

export default useIncidencias;
