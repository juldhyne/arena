import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString({
    message: 'Le nom d’utilisateur doit être une chaîne de caractères.',
  })
  @IsNotEmpty({ message: 'Le nom d’utilisateur ne peut pas être vide.' })
  @Length(3, 20, {
    message: 'Le nom d’utilisateur doit contenir entre 3 et 20 caractères.',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Le nom d’utilisateur ne peut contenir que des lettres, des chiffres et des underscores.',
  })
  username: string;
}
