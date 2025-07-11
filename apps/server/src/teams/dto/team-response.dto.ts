import { Character } from '../../characters/entities/character.entity';

export class TeamResponseDto {
  id: string;
  userId: string;
  name: string;
  characters: Character[];
}
