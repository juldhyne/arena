import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { FirebaseService } from '../config/firebase/firebase.service';
import { CHARACTERS_SLOT } from '../characters/data/characters.data';

@Injectable()
export class TeamsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(userId: string, dto: CreateTeamDto): Promise<Team> {
    const db = this.firebaseService.getDb();

    // 1. Ensure all character IDs are valid
    const validCharacterIds = CHARACTERS_SLOT.map((c) => c.id);
    const invalidIds = dto.characterIds.filter(
      (id) => !validCharacterIds.includes(id),
    );

    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Personnages inconnus: ${invalidIds.join(', ')}`,
      );
    }

    // 2. Ensure all character IDs are unique
    const duplicates = dto.characterIds.filter(
      (id, index, arr) => arr.indexOf(id) !== index,
    );
    if (duplicates.length > 0) {
      throw new BadRequestException(
        `Les personnages suivants sont en double: ${[...new Set(duplicates)].join(', ')}`,
      );
    }

    // 3. Check how many teams the user already has
    const existingTeamsSnapshot = await db
      .collection('teams')
      .where('userId', '==', userId)
      .get();

    const existingTeams = existingTeamsSnapshot.docs.map((doc) => doc.data());

    if (existingTeams.length >= 3) {
      throw new ForbiddenException('Vous avez déjà 3 équipes.');
    }

    // 4. Generate default name if needed
    let teamName = dto.name ?? '';
    if (!teamName) {
      const usedNames = existingTeams.map((team) => team.name);
      for (let i = 1; i <= 3; i++) {
        const proposedName = `Team${i}`;
        if (!usedNames.includes(proposedName)) {
          teamName = proposedName;
          break;
        }
      }
    }

    // 5. Create and store the team
    const newTeam: Omit<Team, 'id'> = {
      userId,
      name: teamName,
      characterIds: dto.characterIds,
    };

    const docRef = await db.collection('teams').add(newTeam);

    return {
      id: docRef.id,
      ...newTeam,
    };
  }

  findAll() {
    return `This action returns all teams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
