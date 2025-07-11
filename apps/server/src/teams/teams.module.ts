import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { FirebaseModule } from '../config/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
