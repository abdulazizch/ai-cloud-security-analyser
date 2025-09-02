import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    const storedExpiration = localStorage.getItem("authExpiration");
    const rememberLogin = localStorage.getItem("rememberLogin") === 'true';

    if (storedAuth) {
      if (rememberLogin) {
        return JSON.parse(storedAuth);
      } else if (storedExpiration) {
        const currentTime = new Date().getTime();
        const expirationTime = new Date(storedExpiration).getTime();

        if (currentTime < expirationTime) {
          return JSON.parse(storedAuth);
        }
      }
    }

    return {};
  });

  useEffect(() => {
    const rememberLogin = localStorage.getItem("rememberLogin") === 'true';
    if (Object.keys(auth).length > 0) {
      if (!rememberLogin) {
        const expirationTime = new Date(new Date().getTime() + 3600000); // 1 hour from now
        localStorage.setItem("authExpiration", expirationTime.toISOString());
      }
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
      localStorage.removeItem("authExpiration");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
