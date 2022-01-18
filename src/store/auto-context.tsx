import React, { useState } from "react";

type autoObj = {
  tokenValue: string | null;
  getToken: (token: string) => void;
  removeToken: (token: string) => void;
};

export const AutoContext = React.createContext<autoObj>({
  tokenValue: "",
  getToken: (token: string) => {},
  removeToken: () => {},
});

const AutoContextProvider: React.FC = (props) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const getTokenHandler = (newToken: string) => {
    setToken(newToken);
  };

  const removeTokenHandler = () => {
    setToken("");
  };

  const contextValue: autoObj = {
    tokenValue: token,
    getToken: getTokenHandler,
    removeToken: removeTokenHandler,
  };

  return (
    <AutoContext.Provider value={contextValue}>
      {props.children}
    </AutoContext.Provider>
  );
};

export default AutoContextProvider;
