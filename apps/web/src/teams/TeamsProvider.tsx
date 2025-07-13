import { createContext, useContext, useEffect, useState } from "react";
import { Character } from "../characters/CharactersProvider";

export class Team {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly characters: Character[],
  ) {}
}

type TeamsContextType = {
  teams: Team[];
  fetchTeams: () => void;
};

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

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

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <TeamsContext.Provider value={{ teams, fetchTeams }}>
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (!context) throw new Error("useTeams must be used inside TeamsProvider");
  return context;
};

export default TeamsProvider;
