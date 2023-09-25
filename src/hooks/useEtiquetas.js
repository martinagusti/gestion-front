import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getClientes } from "../services/clientesService";
import { getEtiquetas } from "../services";

const useEtiquetas = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [etiquetas, setEtiquetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadEtiquetas = async () => {
        try {
          setLoading(true);
          const data = await getEtiquetas();
          setEtiquetas(data);
        } catch (error) {
          console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadEtiquetas();
    }
  }, [token]);

  return {
    etiquetas,
    setEtiquetas,
    loading,
    error,
  };
};

export default useEtiquetas;
