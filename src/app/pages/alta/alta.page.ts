import { Component, OnInit, inject } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { DuenioSupervisor } from 'src/app/clases/duenio-supervisor';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/auth/services/storage.service';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Empleado } from 'src/app/clases/empleado';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.page.html',
  styleUrls: ['./alta.page.scss'],
})
export class AltaPage implements OnInit {

  private authService = inject(AuthService);
  public loggedUser: any;


  isSupported = false;
  barcodes: Barcode[] = [];
  informacionQr: string | null = null;  // Variable para guardar la información del QR escaneado
  perfilSeleccionado :string="";

  // Variables para el formulario
  nombre: string="";
  apellido: string="";
  dni: string="";
  cuil: string="";
  perfil: string="";
  tipo: string="";

  perfilUsuarioActual:string="";
  tipoEmpleado:string="";


  constructor(private alertController: AlertController, private database:DatabaseService, private router: Router, private storage:StorageService ) {}

  ngOnInit() {
    this.loggedUser = this.authService.loggedUser;

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    this.verificarPerfilUsuarioActual();

  }

  async verificarPerfilUsuarioActual() {
    try {
      const usuariosObservable = await this.database.obtenerTodos("usuarios");
      if (usuariosObservable) {
        usuariosObservable.subscribe(usuarios => {
          usuarios.forEach(action => {
            const usuario = action.payload.doc.data() as Usuario & { tipo?: string };  // Añadimos el campo opcional "tipo"
            if (usuario.email === this.loggedUser.email) {
              this.perfilUsuarioActual = usuario.perfil;
              if (this.perfilUsuarioActual === 'Empleado' && usuario.tipo) {
                this.tipoEmpleado = usuario.tipo;
              }
              console.log(this.perfilUsuarioActual);
              console.log(this.tipoEmpleado);
            }
          });
        });
      }
    } catch (error) {
      console.error("Error al obtener los usuarios: ", error);
    }
  }

  seleccionarPerfilAlta(perfil:string){
    this.perfilSeleccionado=perfil;
    console.log(this.perfilSeleccionado);
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length > 0) {
      this.informacionQr = barcodes[0].rawValue;  // Asignar la información del primer código QR escaneado
      this.fillForm(this.informacionQr);  // Rellenar el formulario con la información del QR
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
        this.apellido = qrData[1].trim() ;
        this.nombre = qrData[2].trim() ;
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
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    if (image) {
      this.guardarImagen(image.base64String!);
    }
  }

  guardarImagen(imagen: string){

    this.storage.subirImagen(this.dni+this.nombre+this.apellido,imagen);
    return true
  };


  enviarInformacion(){
    if(this.perfilSeleccionado == "Dueño/Supervisor"){
      const nuevoUsuario = new DuenioSupervisor(this.nombre, this.apellido, this.dni, this.cuil, null, this.perfil);
      const nuevoUsuarioJSON= nuevoUsuario.toJSON();
      this.database.crear("usuarios", nuevoUsuarioJSON );
    }else if(this.perfilSeleccionado== "Empleado"){
      const nuevoUsuario = new Empleado(this.nombre, this.apellido, this.dni, this.cuil, null, this.tipo);
      const nuevoUsuarioJSON= nuevoUsuario.toJSON();
      this.database.crear("usuarios", nuevoUsuarioJSON );
    }
   
    this.router.navigateByUrl('home');

  }


  isFormComplete(): boolean {
    if (this.perfilSeleccionado === 'Dueño/Supervisor') {
      return this.nombre && this.apellido && this.dni && this.cuil && this.perfil ? true : false;
    } else if (this.perfilSeleccionado === 'Empleado') {
      return this.nombre && this.apellido && this.dni && this.cuil && this.tipo ? true : false;
    } else {
      return this.nombre && this.apellido && this.dni ? true : false;
    }
  }


 
}
