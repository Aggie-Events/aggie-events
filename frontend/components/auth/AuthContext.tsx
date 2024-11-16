"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { ReactNode } from "react";

interface AuthContextType {
  user: User | undefined | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined | null>(undefined);

  useEffect(() => {
    const fetchUser = async () =>
      fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/user`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data:", data);
          if (!data.user_email) {
            console.log("No user logged in");
            setUser(null);
          } else {
            setUser(data);
            console.log("Auth context: " + JSON.stringify(data));
          }
        })
        .catch((error) =>
          console.error("Error checking user authentication:", error),
        );
    fetchUser();
  }, []);

  async function logout(): Promise<void> {
    fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          setUser(null);
        } else {
          console.error("Failed to log out:", response.statusText);
        }
      })
      .catch((error) => console.error("Error logging out:", error));
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {user === undefined ? null : children}
    </AuthContext.Provider>
  );
};
