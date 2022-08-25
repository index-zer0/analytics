import React, { createContext, useState } from "react";
import Wrapper, { WrapperProps } from "./Wrapper";

export const UserContext = createContext({});

interface UserProps extends WrapperProps {
    children: React.ReactNode;
    variant?: "small" | "full" | "default";
}

const UserProvider: React.FC<UserProps> = ({
    children
}: UserProps) => {
  const [user, setUser] = useState({});

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};