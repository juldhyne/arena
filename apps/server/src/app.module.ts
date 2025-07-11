import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import firebaseConfig from './config/firebase/firebase.config';
import { FirebaseModule } from './config/firebase/firebase.module';

import { validationSchema } from './config/validation.schema';
import { CharactersModule } from './characters/characters.module';
import jwtConfig from './config/jwt/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [firebaseConfig, jwtConfig],
      validationSchema,
    }),
    FirebaseModule,
    AuthModule,
    CharactersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
