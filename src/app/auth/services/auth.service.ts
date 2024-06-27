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
    return this.database.obtenerClientePorEmail(email)
      .then(async cliente => {
        if (cliente) {
          if (cliente.estado === 'autorizado') {
            // Si el cliente está autorizado, proceder con el login
            return this.afAuth.signInWithEmailAndPassword(email, password)
              .then(userCredential => {
                this.handleSuccessfulAuth(userCredential);
                return userCredential;
              })
              .catch(error => {
                this.handleErrorAuth(error);
                throw error;
              });
          } else {
            // Si el cliente no está autorizado, mostrar alerta y no proceder con el login
            await this.handleClienteEstado(cliente.estado);
            throw new Error('Cliente no autorizado');
          }
        } else {
          // Si no se encuentra el cliente, proceder con el login normal
          return this.afAuth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
              this.handleSuccessfulAuth(userCredential);
              return userCredential;
            })
            .catch(error => {
              this.handleErrorAuth(error);
              throw error;
            });
        }
      })
      .catch(error => {
        console.error('Error retrieving cliente:', error);
        this.handleErrorAuth(error);
      });
  }


  handleClienteEstado(estado: string) {
    switch (estado) {
      case 'pendiente':
        return this.showEstadoAlert('Acceso denegado', 'Tu cuenta está pendiente de aprobación.', 'warning');
      case 'rechazado':
        return this.showEstadoAlert('Acceso denegado', 'Tu cuenta ha sido rechazada.', 'error');
      default:
        return this.showEstadoAlert('Acceso denegado', 'Estado de cuenta desconocido.', 'error');
    }
  }

  showEstadoAlert(title: string, text: string, icon: 'warning' | 'error') {
    this.logout();
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--ion-color-primary)',
      heightAuto: false,
    });
  }


  register(email: string, password: string, docId?: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
        this.handleSuccessfulAuth(userCredential, 'Usuario registrado exitosamente!');
          this.logout();
          resolve();
        })
        .catch((error) => {
          this.handleErrorAuth(error, docId);
          reject(error);
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

  handleErrorAuth(error: any, docId?: any): void {
    if (docId) {
      this.database.borrar('clientes', docId)
        .then(() => {
          console.log('Documento borrado con éxito');
          // Puedes agregar aquí cualquier lógica adicional que desees ejecutar después del borrado exitoso
        })
        .catch((err) => {
          console.error('Error al borrar el documento: ', err);
          // Muestra un mensaje de error si el borrado falla

        });
    }

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
