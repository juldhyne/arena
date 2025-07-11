import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { FirebaseService } from '../config/firebase/firebase.service';
import { CHARACTERS_SLOT } from '../core/data/characters/characters_slot';
import { TeamResponseDto } from './dto/team-response.dto';

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

  async findAll(userId: string): Promise<TeamResponseDto[]> {
    const db = this.firebaseService.getDb();

    try {
      const snapshot = await db
        .collection('teams')
        .where('userId', '==', userId)
        .get();

      const teams: TeamResponseDto[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        // Map characterIds to full Character objects
        const characters = (data.characterIds as string[])
          .map((id) => CHARACTERS_SLOT.find((c) => c.id === id))
          .filter((c) => !!c); // Remove undefined values (in case of invalid IDs)

        return {
          id: doc.id,
          userId: data.userId,
          name: data.name,
          characters,
        };
      });

      return teams;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des équipes pour l'utilisateur ${userId}:`,
        error,
      );
      throw new BadRequestException(
        'Une erreur est survenue lors de la récupération de vos équipes.',
      );
    }
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
