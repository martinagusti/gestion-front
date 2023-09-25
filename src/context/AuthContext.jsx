import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthproviderComponent = ({ children }) => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("gestionUser"))
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("gestionUser"))
  );

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
