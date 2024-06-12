import { Injectable, NgZone, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { TestUser } from '../interfaces/testUser.Interface';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private validatorsService = inject(ValidatorsService);
  private toastService = inject(ToastService);

  public loggedUser?: any;

  public testUsers: TestUser[] = [
    {
      id: 1,
      email: 'admin@admin.com',
      password: '111111',
      profile: 'admin',
      gender: 'femenino',
    },
    {
      id: 2,
      email: 'invitado@invitado.com',
      password: '222222',
      profile: 'invitado',
      gender: 'femenino',
    },
    {
      id: 3,
      email: 'usuario@usuario.com',
      password: '333333',
      profile: 'usuario',
      gender: 'masculino',
    },
    {
      id: 4,
      email: 'anonimo@anonimo.com',
      password: '444444',
      profile: 'usuario',
      gender: 'masculino',
    },
    {
      id: 5,
      email: 'tester@tester.com',
      password: '555555',
      profile: 'tester',
      gender: 'femenino',
    },
  ];

  constructor() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.loggedUser = user;
        localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
      } else {
        localStorage.setItem('loggedUser', 'null');
      }
    });
  }

  getLoggedUser() {
    this.afAuth.authState.subscribe((user) => {
     return user;
    });
  }

  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.handleSuccessfulAuth(userCredential);
      })
      .catch((error) => {
        this.handleErrorAuth(error);
      });
  }

  register(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.handleSuccessfulAuth(userCredential);
      })
      .catch((error) => {
        this.handleErrorAuth(error);
      });
  }

  observeUserState() {
    this.afAuth.authState.subscribe((userState) => {
      userState && this.ngZone.run(() => this.router.navigate(['/home']));
    });
  }

  handleSuccessfulAuth(userCredential: any): void {
    this.loggedUser = userCredential.user;
    this.toastService.presentToast('Bienvenido!', 'middle', 'success');
    this.observeUserState();
  }

  handleErrorAuth(error: any): void {
    const errorMessage = this.validatorsService.getFirebaseAuthErrorByCode(error.code);
    this.toastService.presentToast(errorMessage, 'middle', 'danger');
    console.log(error.code);
    console.error(error.message);
  }

  get isLoggedIn(): boolean {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser')!);
    return loggedUser !== null;
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('loggedUser');
      this.router.navigate(['/auth/login']);
    });
  }
}
