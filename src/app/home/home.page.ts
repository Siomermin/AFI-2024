import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { DatabaseService } from '../auth/services/database.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, Platform } from '@ionic/angular';
import { FcmService } from '../shared/services/fcm.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {

  isSupported = false;
  barcodes: Barcode[] = [];
  informacionQr: string | null = null;

  private authService = inject(AuthService);
  public loggedUser: any;
  private _perfilUsuarioActual: string = '';

  constructor(
    private router: Router,
    private database: DatabaseService,
    private alertController: AlertController,
    private platform: Platform,
    private fcm: FcmService
  ) {
    this.platform.ready().then(() => {
      this.loggedUser = this.authService.loggedUser;
      console.log(this.loggedUser.email);
      console.log(this.loggedUser.uid);
      this.fcm.initPush(this.loggedUser.uid);  // Asegúrate de pasar el UID del usuario aquí
    }).catch(e => {
      console.log('error fcm: ', e);
    });
  }

  ngOnInit(): void {
    this.loggedUser = this.authService.loggedUser;

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
      BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then((res) => {
        if (res.available == false) {
          BarcodeScanner.installGoogleBarcodeScannerModule().then(() => {
            BarcodeScanner.addListener("googleBarcodeScannerModuleInstallProgress", () => console.log("Instalación finalizada"));
          })
          .catch((ins) => console.log("Error install: " + ins));
        }
      }).catch((err) => console.log("Error available: " + err));
    });

    this.verificarPerfilUsuarioActual();
  }

  get perfilUsuarioActual(): string {
    return this._perfilUsuarioActual.toLowerCase();
  }

  logout() {
    this.authService.logout();
  }

  redireccionar(path: string) {
    this.router.navigateByUrl(path);
  }

  async verificarPerfilUsuarioActual() {
    try {
      const usuario = await this.database.obtenerUsuarioPorEmail(this.loggedUser.email);
      if (usuario) {
        this._perfilUsuarioActual = usuario.perfil;
      } else {
        this._perfilUsuarioActual = 'cliente'; // Perfil predeterminado si no se encuentra el usuario
      }
      console.log(this._perfilUsuarioActual);
    } catch (error) {
      console.error('Error al verificar el perfil del usuario:', error);
    }
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

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length > 0) {
      this.informacionQr = barcodes[0].rawValue;  // Asignar la información del primer código QR escaneado
    } else {
      this.informacionQr = 'No barcode detected';
    }

    if(this.informacionQr == 'propina' ||this.informacionQr == 'ingreso') {
      this.router.navigateByUrl("qr-"+ this.informacionQr);
    }else{

      const navigationExtras: NavigationExtras = {
        queryParams: { dato: this.informacionQr }
      };
     
      this.router.navigate(['qr-mesa'], navigationExtras);
    }
  
    }
  
  async stopScan(): Promise<void> {
    await BarcodeScanner.stopScan();
  }

  mesa(){
    const navigationExtras: NavigationExtras = {
      queryParams: { dato: "8"  }
    };

    this.router.navigate(['qr-mesa'], navigationExtras);
  }
  
}
