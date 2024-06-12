import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { DuenioSupervisor } from 'src/app/clases/duenio-supervisor';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/auth/services/storage.service';
@Component({
  selector: 'app-alta',
  templateUrl: './alta.page.html',
  styleUrls: ['./alta.page.scss'],
})
export class AltaPage implements OnInit {


  isSupported = false;
  barcodes: Barcode[] = [];
  informacionQr: string | null = null;  // Variable para guardar la información del QR escaneado

  // Variables para el formulario
  nombre: string="";
  apellido: string="";
  dni: string="";
  cuil: string="";
  perfil: string="";

  nuevosDatos:any;

  constructor(private alertController: AlertController, private database:DatabaseService, private router: Router, private storage:StorageService ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
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
    this.nuevosDatos = new DuenioSupervisor(this.nombre, this.apellido, this.dni, this.cuil, null, this.perfil);
    this.database.crear("usuarios", this.nuevosDatos );
    this.router.navigateByUrl('home');
    return true;
  }


 

 
}
