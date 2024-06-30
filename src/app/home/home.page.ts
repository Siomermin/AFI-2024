import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../auth/services/database.service';
import { Usuario } from '../clases/usuario';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
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
  perfilUsuarioActual:string="";

  constructor(private router:Router,
              private database:DatabaseService,
              private alertController: AlertController,
              private platform: Platform,
              private fcm: FcmService
  ){
    this.platform.ready().then(() => {
      this.loggedUser = this.authService.loggedUser;
      this.fcm.initPush(this.loggedUser.uid);  // Asegúrate de pasar el UID del usuario aquí
    }).catch(e => {
      console.log('error fcm: ', e);
    });
  }

  ngOnInit(): void {
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

  logout() {
    this.authService.logout();
  }

  redireccionar(path:string){
    this.router.navigateByUrl(path);
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
              console.log(this.perfilUsuarioActual);
            }
          });
        });
      }
    } catch (error) {
      console.error("Error al obtener los usuarios: ", error);
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
  }

  async stopScan(): Promise<void> {
    await BarcodeScanner.stopScan();
  }

}
