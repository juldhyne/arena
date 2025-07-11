import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export class Character {
  constructor(public readonly id: string, public readonly name: string) {}
}

const CharactersContext = createContext<Character[]>([]);

export const CharactersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  // Load token and user on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      fetchCharacters(storedToken);
    }
  }, []);

  const fetchCharacters = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/characters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Invalid token");

      const data = await res.json();

      setCharacters(data);
    } catch (err) {
      console.error("Error loading characters from token:", err);
    }
  };

  return (
    <CharactersContext.Provider value={characters}>
      {children}
    </CharactersContext.Provider>
  );
};

export const useCharacters = () => {
  const context = useContext(CharactersContext);
  if (!context)
    throw new Error("useCharacters must be used inside CharactersProvider");
  return context;
};

export default CharactersProvider;
