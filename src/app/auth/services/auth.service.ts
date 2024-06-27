import { Injectable, NgZone, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { TestUser } from '../interfaces/testUser.Interface';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import Swal from 'sweetalert2';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private validatorsService = inject(ValidatorsService);
  private database = inject(DatabaseService);

  public loggedUser?: any;

  public testUsers: TestUser[] = [
    {
      id: 1,
      email: 'duenio@duenio.com',
      password: '111111',
      profile: 'dueño',
      gender: 'femenino',
    },
    {
      id: 2,
      email: 'supervisor@supervisor.com',
      password: '222222',
      profile: 'supervisor',
      gender: 'femenino',
    },
    {
      id: 3,
      email: 'empleado@empleado.com',
      password: '333333',
      profile: 'empleado',
      gender: 'masculino',
    },
    {
      id: 4,
      email: 'cliente@cliente.com',
      password: '444444',
      profile: 'cliente',
      gender: 'masculino',
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
      .then(async (userCredential) => {
        try {
          const cliente = await this.database.obtenerClientePorEmail(email);
          console.log(cliente);
          if (cliente) {
            this.handleClienteEstado(cliente.estado, userCredential);
          } else {
            this.handleSuccessfulAuth(userCredential);
          }
        } catch (error) {
          console.error('Error retrieving cliente:', error);
          this.handleErrorAuth(error);
        }
      })
      .catch((error) => {
        this.handleErrorAuth(error);
      });
  }

  handleClienteEstado(estado: string, userCredential: any) {
    switch (estado) {
      case 'autorizado':
        this.handleSuccessfulAuth(userCredential);
        break;
      case 'pendiente':
        this.showEstadoAlert('Acceso denegado', 'Tu cuenta está pendiente de aprobación.', 'warning');
        break;
      case 'rechazado':
        this.showEstadoAlert('Acceso denegado', 'Tu cuenta ha sido rechazada.', 'error');
        break;
      default:
        this.showEstadoAlert('Acceso denegado', 'Estado de cuenta desconocido.', 'error');
        break;
    }
  }

  showEstadoAlert(title: string, text: string, icon: 'warning' | 'error') {
    this.logout();
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--ion-color-primary)',
      heightAuto: false,
    });
  }

  register(email: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          this.handleSuccessfulAuth(userCredential, 'Usuario registrado exitosamente. Su solicitud sera evaluada a la brevedad...');
          this.logout();
          resolve(); // Resolve the promise when registration is successful
        })
        .catch((error) => {
          this.handleErrorAuth(error);
          reject(error); // Reject the promise with the error when registration fails
        });
    });
  }

  observeUserState() {
    this.afAuth.authState.subscribe((userState) => {
      userState && this.ngZone.run(() => this.router.navigate(['/home']));
    });
  }

  handleSuccessfulAuth(userCredential: any, text: string = ''): void {
    this.loggedUser = userCredential.user;
    this.observeUserState();
    Swal.fire({
      title: 'Bienvenido!',
      text: text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--ion-color-primary)',
      heightAuto: false,
    });
  }

  handleErrorAuth(error: any): void {
    const errorMessage = this.validatorsService.getFirebaseAuthErrorByCode(error.code);
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--ion-color-primary)',
      heightAuto: false,
    });
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
