import { Injectable } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';
import { CHARACTERS_SLOT } from '../core/data/characters/characters_slot';

@Injectable()
export class CharactersService {
  create(createCharacterDto: CreateCharacterDto) {
    return 'This action adds a new character';
  }

  findAll(): Character[] {
    return CHARACTERS_SLOT;
  }

  findOne(id: number) {
    return `This action returns a #${id} character`;
  }

  update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`;
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
  }
}
