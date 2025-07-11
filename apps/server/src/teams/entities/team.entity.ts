export class Team {
  id: string;
  userId: string;
  name: string;
  characterIds: string[];

  constructor(userId: string, characterIds: string[], name = 'My Team') {
    this.userId = userId;
    this.characterIds = characterIds;
    this.name = name;
  }
}
