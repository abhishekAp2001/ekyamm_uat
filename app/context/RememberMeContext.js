"use client";

import { createContext, useContext, useState, useEffect } from "react";

const RememberMeContext = createContext();

export function RememberMeProvider({ children }) {
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ Load from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem("rememberMe");
    if (saved === "true") {
      setRememberMe(true);
    }
  }, []);

  // ✅ Wrap setter to always sync with localStorage
  const updateRememberMe = (value) => {
    setRememberMe(value);
    localStorage.setItem("rememberMe", value ? "true" : "false");
  };

  return (
    <RememberMeContext.Provider value={{ rememberMe, setRememberMe: updateRememberMe }}>
      {children}
    </RememberMeContext.Provider>
  );
}

export function useRememberMe() {
  return useContext(RememberMeContext);
}
