import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
  IsOptional,
  IsUUID,
  ArrayUnique,
} from 'class-validator';

export class CreateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @ArrayUnique({
    message: 'Les personnages ne peuvent pas être en double.',
  })
  @ArrayMinSize(5, {
    message: 'L’équipe doit contenir exactement 5 personnages.',
  })
  @ArrayMaxSize(5, {
    message: 'L’équipe doit contenir exactement 5 personnages.',
  })
  @ArrayUnique({
    message: 'Les personnages ne peuvent pas être en double.',
  })
  @IsString({ each: true }) // Each character ID must be a string
  characterIds: string[];
}
