import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export class User {
  constructor(public readonly username: string) {}
}

class AuthContextType {
  constructor(
    public readonly user: User | null,
    public readonly token: string | null,
    public readonly onSessionCreated: (token: string) => void,
    public readonly onSessionClosed: () => void,
  ) {}
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load token and user on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Invalid token");

      const data = await res.json();

      setUser(new User(data.username));
    } catch (err) {
      console.error("Error loading user from token:", err);
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  const onSessionCreated = (newToken: string) => {
    setToken(newToken);

    localStorage.setItem("token", newToken);

    fetchUser(newToken);

    navigate("/");
  };

  const onSessionClosed = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");

    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, onSessionCreated, onSessionClosed }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

export default AuthProvider;
