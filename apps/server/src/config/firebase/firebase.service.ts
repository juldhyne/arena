import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    if (!getApps().length) {
      console.log('✅ Initializing Firebase App...');
      initializeApp({
        credential: cert({
          projectId: this.configService.get<string>('firebase.projectId'),
          clientEmail: this.configService.get<string>('firebase.clientEmail'),
          privateKey: this.configService.get<string>('firebase.privateKey'),
        }),
      });
    } else {
      console.log('⚠️ Firebase App already initialized.');
    }

    this.db = getFirestore();
  }

  getDb() {
    return this.db;
  }

  getFirebaseAuthenticationAPIURL() {
    return `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.configService.get<string>('firebase.webApiKey')}`;
  }
}
