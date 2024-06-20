import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/auth/services/storage.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Cliente } from 'src/app/clases/cliente';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-alta',
  templateUrl: './alta.page.html',
  styleUrls: ['./alta.page.scss'],
})
export class AltaPage implements OnInit {
  public loggedUser: any;
  private authService = inject(AuthService);

  isSupported = false;
  barcodes: Barcode[] = [];
  informacionQr: string | null = null; // Variable para guardar la información del QR escaneado

  // Variables para el formulario
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  email: string = '';
  clave: string = '';
  fotoUrl: any = '';
  form: FormGroup;
  clientesExistentes: any[] = [];
  clienteAnonimo: boolean = false;

  constructor(
    private alertController: AlertController,
    private database: DatabaseService,
    private router: Router,
    private storage: StorageService,
    private fb: FormBuilder // Añadido FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      apellido: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)],
      ],
      dni: ['', [Validators.required, Validators.pattern(/^\d{1,10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    const menuObservable: Observable<any[]> = this.database
      .obtenerTodos('clientes')!
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );

    menuObservable.subscribe(
      (data) => {
        this.clientesExistentes = data;
        console.log(this.clientesExistentes);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  toggleAnonimo(event: any) {
    this.clienteAnonimo = event.detail.checked;
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length > 0) {
      this.informacionQr = barcodes[0].rawValue; // Asignar la información del primer código QR escaneado
      this.fillForm(this.informacionQr); // Rellenar el formulario con la información del QR
    }
    this.barcodes.push(...barcodes);
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  fillForm(informacionQr: string): void {
    try {
      const qrData = informacionQr.split('@');
      if (qrData.length >= 4) {
        this.apellido = qrData[1].trim();
        this.nombre = qrData[2].trim();
        this.dni = qrData[4].trim();
        // Puedes seguir agregando campos aquí según la información del QR
      } else {
        throw new Error('Formato de QR incorrecto');
      }
    } catch (error) {
      console.error('Error parsing QR data', error);
      this.presentAlertError('Error parsing QR data');
    }
  }

  async presentAlertError(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
      });

      if (image) {
        this.fotoUrl = image.base64String;
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      alert('Ocurrió un error al tomar la foto.');
    }
  }
  async guardarImagen(imagen: string): Promise<boolean> {
    try {
      await this.storage.subirImagen(
        this.dni + this.nombre + this.apellido,
        imagen
      );
      return true;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Ocurrió un error al subir la imagen.');
      return false;
    }
  }

  verificarUsuarioExistente(dni: any) {
    const clienteEncontrado = this.clientesExistentes.find(
      (cliente) => cliente.dni === dni
    );
    return !!clienteEncontrado; // Devuelve true si se encontró el cliente, false de lo contrario
  }

  async enviarInformacion() {
    console.log(this.dni);
    if (this.verificarUsuarioExistente(this.form.value.dni)) {
      Swal.fire({
        title: 'Error',
        text: 'Ya hay un usuario registrado con ese DNI',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'red',
        heightAuto: false,
      }).then(() => {
        this.router.navigateByUrl('auth/login');
      });
    } else {
      if (this.form.invalid) {
        return;
      }

      const { nombre, apellido, dni, email, clave } = this.form.value;
      const nuevoUsuario = new Cliente(
        nombre,
        apellido,
        dni,
        this.dni + this.nombre + this.apellido,
        email,
        clave,
        'pendiente'
      );

      // Registro authentication firebase
      this.authService
        .register(email, clave)
        .then(() => {
          const imagenGuardada = this.guardarImagen(this.fotoUrl);
          imagenGuardada
            .then((imagenGuardada) => {
              if (imagenGuardada) {
                this.database
                  .crear('clientes', nuevoUsuario.toJSON())
                  .then((docRef) => {
                    console.log('Documento escrito con ID: ', docRef.id);

                    this.router.navigateByUrl('auth/login');
                  })
                  .catch((error) => {
                    console.error('Error al crear el usuario:', error);
                  });
              } else {
                console.error(
                  'No se pudo guardar la imagen, abortando creación de usuario.'
                );
                Swal.fire({
                  title: 'Error',
                  text: 'No se pudo guardar la imagen, abortando creación de usuario.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: 'var(--ion-color-primary)',
                  heightAuto: false,
                });
              }
            })
            .catch((error) => {
              console.error('Error al guardar la imagen:', error);
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al guardar la imagen. Por favor, inténtelo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'var(--ion-color-primary)',
                heightAuto: false,
              });
            });
        })
        .catch((error) => {
          console.error('Error al registrar el usuario:', error);
        });
    }
  }
}
