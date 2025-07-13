import { useState } from "react";
import { useCharacters } from "../characters/CharactersProvider";
import { useTeams } from "./TeamsProvider";

const TeamsList = () => {
  const { teams, fetchTeams } = useTeams();
  const characters = useCharacters();

  const [showForm, setShowForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);

  const storedToken = localStorage.getItem("token");

  const toggleCharacter = (id: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(id)
        ? prev.filter((cid) => cid !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev,
    );
  };

  const submitTeam = async () => {
    if (!storedToken) return;

    try {
      const res = await fetch("http://localhost:8000/teams", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: teamName,
          characterIds: selectedCharacters,
        }),
      });

      if (!res.ok) throw new Error("Failed to create team");

      // Refresh teams without reload
      await fetchTeams();

      // Reset form
      setShowForm(false);
      setTeamName("");
      setSelectedCharacters([]);
    } catch (err) {
      console.error("Failed to submit team", err);
    }
  };

  return (
    <div>
      <h1>List of your teams</h1>
      {teams.length > 0 ? (
        teams.map((t) => (
          <p key={t.id}>
            {t.name + " - " + t.characters.map((c) => c.name).join(", ")}
          </p>
        ))
      ) : (
        <p>You don't have teams</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)}>Create new team</button>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <div>
            <p>Select up to 5 characters:</p>
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => toggleCharacter(char.id)}
                style={{
                  margin: "0.3rem",
                  backgroundColor: selectedCharacters.includes(char.id)
                    ? "lightgreen"
                    : "lightgray",
                }}
              >
                {char.name}
              </button>
            ))}
          </div>

          <button
            onClick={submitTeam}
            disabled={teamName.trim() === "" || selectedCharacters.length === 0}
          >
            Submit team
          </button>

          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TeamsList;
