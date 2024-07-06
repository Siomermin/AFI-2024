import { Injectable, NgZone, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { TestUser } from '../interfaces/testUser.Interface';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import Swal from 'sweetalert2';
import { DatabaseService } from './database.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private validatorsService = inject(ValidatorsService);
  private database = inject(DatabaseService);
  private notificationService = inject(NotificationService);

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
      id: 4,
      email: 'cliente@cliente.com',
      password: '444444',
      profile: 'cliente',
      gender: 'masculino',
    },
    {
      id: 5,
      email: 'maitre@maitre.com',
      password: '555555',
      profile: 'maitre',
      gender: 'masculino',
    },
    {
      id: 6,
      email: 'mozo@mozo.com',
      password: '666666',
      profile: 'mozo',
      gender: 'masculino',
    },
    {
      id: 7,
      email: 'cocinero@cocinero.com',
      password: '777777',
      profile: 'cocinero',
      gender: 'masculino',
    },
    {
      id: 8,
      email: 'bartender@bartender.com',
      password: '888888',
      profile: 'bartender',
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
    return this.database
      .obtenerClientePorEmail(email)
      .then(async (cliente) => {
        if (cliente) {
          if (cliente.estado === 'autorizado') {
            // Si el cliente está autorizado, proceder con el login
            return this.afAuth
              .signInWithEmailAndPassword(email, password)
              .then((userCredential) => {
                this.handleSuccessfulAuth(userCredential);
                return userCredential;
              })
              .catch((error) => {
                this.handleErrorAuth(error);
                return;
              });
          } else {
            // Si el cliente no está autorizado, mostrar alerta y no proceder con el login
            await this.handleClienteEstado(cliente.estado);
            return;
          }
        } else {
          // Si no se encuentra el cliente, proceder con el login normal
          return this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
              this.handleSuccessfulAuth(userCredential);
              return userCredential;
            })
            .catch((error) => {
              this.handleErrorAuth(error);
            });
        }
      })
      .catch((error) => {
        console.error('Error retrieving cliente:', error);
        this.handleErrorAuth(error);
      });
  }

  handleClienteEstado(estado: string) {
    switch (estado) {
      case 'pendiente':
        return this.showEstadoAlert(
          'Acceso denegado',
          'Tu cuenta está pendiente de aprobación.',
          'warning'
        );
      case 'rechazado':
        return this.showEstadoAlert(
          'Acceso denegado',
          'Tu cuenta ha sido rechazada.',
          'error'
        );
      default:
        return this.showEstadoAlert(
          'Acceso denegado',
          'Estado de cuenta desconocido.',
          'error'
        );
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
          this.handleSuccessfulAuth(
            userCredential,
            'Usuario registrado exitosamente!'
          );

          this.logout();

          this.notificationService.sendNotificationToRole(
            'Nuevo Cliente Registrado!',
            'Hay nuevos clientes esperando su aprobación',
            'Supervisor'
          ).subscribe(
            response => console.log('Notificación a Supervisor enviada con éxito', response),
            error => console.error('Error al enviar notificación a Supervisor', error)
          );

          this.notificationService.sendNotificationToRole(
            'Nuevo Cliente Registrado!',
            'Hay nuevos clientes esperando su aprobación',
            'Dueño'
          ).subscribe(
            response => console.log('Notificación a Dueño enviada con éxito', response),
            error => console.error('Error al enviar notificación a Dueño', error)
          );


          resolve();
        })
        .catch((error) => {
          this.handleErrorAuth(error, docId);
          reject(error);
        });
    });
  }

  public async registerAnonymous(clienteId: string, usuario: any) {
    try {
      const userCredential = await this.afAuth.signInAnonymously();
      const user = userCredential.user;

      if (user) {
        await this.database.actualizar(
          'clientes',
          { uid: user.uid,
            ...usuario
           },
          clienteId
        );

        Swal.fire({
          title: 'Éxito',
          text: 'Cliente anónimo registrado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--ion-color-primary)',
          heightAuto: false,
        });

        this.ngZone.run(() => {
          this.router.navigate(['/home']);
        });
      }
    } catch (error) {
      console.error('Error al registrar cliente anónimo:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al registrar el cliente anónimo. Por favor, inténtelo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'var(--ion-color-primary)',
        heightAuto: false,
      });
    }
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
      this.database
        .borrar('clientes', docId)
        .then(() => {
          console.log('Documento borrado con éxito');
          // Puedes agregar aquí cualquier lógica adicional que desees ejecutar después del borrado exitoso
        })
        .catch((err) => {
          console.error('Error al borrar el documento: ', err);
          // Muestra un mensaje de error si el borrado falla
        });
    }

    // const errorMessage = this.validatorsService.getFirebaseAuthErrorByCode(
    //   error.code
    // );
    // Swal.fire({
    //   title: 'Error',
    //   text: errorMessage,
    //   icon: 'error',
    //   confirmButtonText: 'Aceptar',
    //   confirmButtonColor: 'var(--ion-color-primary)',
    //   heightAuto: false,
    // });
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
