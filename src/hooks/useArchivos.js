import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getArchivos } from "../services/tareasService";

const useArchivos = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [archivos, setArchivos] = useState([]);
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

          setArchivos(data);
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
    loading,
    error,
  };
};

export default useArchivos;
