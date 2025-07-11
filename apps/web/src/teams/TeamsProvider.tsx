import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../characters/CharactersProvider";

export class Team {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly characters: Character[],
  ) {}
}

const TeamsContext = createContext<Team[]>([]);

export const TeamsProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      fetchTeams(storedToken);
    }
  }, []);

  const fetchTeams = async (token: string) => {
    console.log(token);

    try {
      const res = await fetch("http://localhost:8000/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Invalid token");

      const data = await res.json();

      setTeams(data);
    } catch (err) {
      console.error("Error loading teams", err);
    }
  };

  return (
    <TeamsContext.Provider value={teams}>{children}</TeamsContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (!context) throw new Error("useTeams must be used inside TeamsProvider");
  return context;
};

export default TeamsProvider;
