import React, { createContext, useContext, useState } from "react";

// create context
const AppContext = createContext();

// provider component
export const AppProvider = ({ children }) => {
  const [search, setSearch] = useState("nature");

  return (
    <AppContext.Provider value={{ search, setSearch }}>
      {children}
    </AppContext.Provider>
  );
};

// custom hook for consuming context
export const useGlobalContext = () => {
  return useContext(AppContext);
};
