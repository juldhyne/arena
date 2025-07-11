import TeamsProvider, { useTeams } from "./TeamsProvider";

const TeamsList = () => {
  const teams = useTeams();
  return (
    <div>
      <h1>List of your teams</h1>
      {teams.length > 0 ? (
        teams.map((t) => (
          <>
            <p>{t.name + " - " + t.characters.map((t) => t.name).join(", ")}</p>
          </>
        ))
      ) : (
        <>
          <p>You dont have teams</p>
        </>
      )}
    </div>
  );
};

export default TeamsList;
