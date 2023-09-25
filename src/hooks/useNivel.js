import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useNivel = () => {
  const { setToken, setUser, token } = useContext(AuthContext);

  const [nivel, setNivel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gestionUser"));
    if (user) {
      const loadNivel = async () => {
        setNivel(user.nivel);
      };
      loadNivel();
    }
  }, [token]);

  return {
    nivel,
    loading,
    error,
  };
};

export default useNivel;
