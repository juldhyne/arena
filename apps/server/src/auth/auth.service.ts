import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { FirebaseService } from '../config/firebase/firebase.service';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async getAuthenticatedUser(uid: string) {
    try {
      const db = this.firebaseService.getDb();
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new UnauthorizedException('Utilisateur introuvable');
      }

      const userData = userDoc.data();
      return {
        uid,
        username: userData?.username,
        email: userData?.email,
        createdAt: userData?.createdAt,
      };
    } catch (error) {
      console.error('Erreur dans /auth/me:', error);
      throw new UnauthorizedException('Erreur de récupération du profil');
    }
  }

  async signup(dto: SignupDto) {
    const { email, password } = dto;
    let username = dto.username;

    try {
      const userRecord = await admin.auth().createUser({ email, password });

      username = username ?? this.generateDefaultUsername();

      const db = this.firebaseService.getDb();
      await db.collection('users').doc(userRecord.uid).set({
        email,
        username,
        createdAt: new Date().toISOString(),
      });

      // Generate token
      const token = this.jwtService.sign(
        {
          uid: userRecord.uid,
          email,
          username,
        },
        {
          expiresIn: '1h', // Optional: customize as needed
        },
      );

      return {
        message: 'Utilisateur créé',
        uid: userRecord.uid,
        username,
        token, // <-- return token here
      };
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException('Email déjà utilisé');
      }
      throw new UnauthorizedException(
        "Erreur lors de la création de l'utilisateur",
      );
    }
  }

  async signin(dto: SigninDto) {
    const { email, password } = dto;

    try {
      const url = this.firebaseService.getFirebaseAuthenticationAPIURL();

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new UnauthorizedException(
          data.error?.message || 'Identifiants invalides',
        );
      }

      const db = this.firebaseService.getDb();
      const userDoc = await db.collection('users').doc(data.localId).get();
      const user = userDoc.data();

      const token = this.jwtService.sign({
        uid: data.localId,
        email: data.email,
        username: user?.username || null,
      });

      return { token };
    } catch (error) {
      throw new UnauthorizedException("Erreur d'authentification");
    }
  }

  async signout(uid: string) {
    try {
      await admin.auth().revokeRefreshTokens(uid);
      return { message: 'Déconnecté et tokens Firebase révoqués.' };
    } catch (error) {
      console.error('Erreur lors de la révocation des tokens:', error);
      throw new UnauthorizedException('Erreur lors de la déconnexion.');
    }
  }

  private generateDefaultUsername(): string {
    const randomSuffix = randomBytes(4).toString('hex');
    return `user_${randomSuffix}`;
  }
}
