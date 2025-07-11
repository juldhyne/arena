import { useCharacters } from "./CharactersProvider";

const CharactersList = () => {
  const characters = useCharacters();
  return (
    <div>
      <h1>List of characters</h1>
      {characters.map((c) => (
        <>
          <p>{c.name}</p>
        </>
      ))}
    </div>
  );
};

export default CharactersList;
