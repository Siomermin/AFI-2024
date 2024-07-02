import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BarcodeScanner, Barcode } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedir-cuenta',
  templateUrl: './pedir-cuenta.page.html',
  styleUrls: ['./pedir-cuenta.page.scss'],
})
export class PedirCuentaPage implements OnInit {
  listaPedidos: any[] = [];
  pedidoActual: any = null;
  idUsuarioActual: string | null = null; // Asegúrate de definir el tipo adecuado
  preciosUnitarios: any[] = [];
  isSupported = false;
  barcodes: Barcode[] = [];
  informacionQr: string | null = null;
  totalConAjustes: number | null = null;
  descuento: number | null = null;
  descuentoNumero: number | null = null;
  mostrarJuego = false;
  propina = 0;

  constructor(
    private afAuth: AngularFireAuth,
    private database: DatabaseService,
    private router: Router,
    private alertController: AlertController,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.idUsuarioActual = user.uid;
        this.cargarPedidos();
      }
    });

    this.activatedRouter.queryParams.subscribe((params) => {
      this.propina = parseInt(params['dato']) || 0; // Asegúrate de manejar el caso donde no hay dato
      this.actualizarTotalConAjustes();
    });
  }

  calcularTotalConDescuento(): void {
    const descuento = this.descuento ? (this.pedidoActual.montoTotal * this.descuento) / 100 : 0;
    this.descuentoNumero = descuento;
    this.totalConAjustes = this.pedidoActual.montoTotal - descuento + this.propina;
  }

  actualizarTotalConAjustes(): void {
    if (this.pedidoActual) {
      this.totalConAjustes = this.pedidoActual.montoTotal + (this.propina || 0);
      if (this.descuento !== null) {
        this.calcularTotalConDescuento();
      }
    } else {
      this.totalConAjustes = null;
    }
  }

  recibirDatos(datos: any): void {
    this.descuento = parseInt(datos) || null; // Asegúrate de manejar el caso donde datos no son válidos
    if (this.descuento !== null) {
      this.mostrarJuego = false;
    }
    this.actualizarTotalConAjustes();
  }

  cargarPedidos(): void {
    this.database.obtenerTodos('pedidos')?.subscribe((pedidos) => {
      this.listaPedidos = pedidos.map((pedido: any) => pedido.payload.doc.data());

      for (let item of this.listaPedidos) {
        if (item.idCliente === this.idUsuarioActual && item.estado === 'entregado-confirmado') {
          this.pedidoActual = item;
          this.preciosUnitarios = item.preciosUnitarios;
          console.log(this.pedidoActual);
          this.actualizarTotalConAjustes();
          break; // Termina el bucle una vez que se encuentra el pedido actual
        }
      }
    });
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
    }
    this.barcodes.push(...barcodes);

    const navigationExtras: NavigationExtras = {
      queryParams: { dato: this.pedidoActual ? parseInt(this.pedidoActual.montoTotal) : 0 }
    };

    console.log(navigationExtras);
    this.router.navigate(['qr-' + this.informacionQr!], navigationExtras);
  }

  ir(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { dato: this.pedidoActual ? parseInt(this.pedidoActual.montoTotal) : 0 }
    };

    console.log(navigationExtras);
    this.router.navigate(['qr-propina'], navigationExtras);
  }

  realizarPago(): void {
    if (!this.pedidoActual) return; // Asegura que haya un pedido actual antes de continuar

    const pedidoActualizado = {
      estado: 'finalizado',
      idCliente: this.pedidoActual.idCliente,
      items: this.pedidoActual.items,
      preciosUnitarios: this.pedidoActual.preciosUnitarios,
      montoTotal: this.pedidoActual.montoTotal,
      tiempo: this.pedidoActual.tiempo,
    };

    this.database
      .actualizar('pedidos', pedidoActualizado, this.pedidoActual.id)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Pago realizado exitosamente',
          showConfirmButton: false,
          heightAuto: false,
          timer: 1500,
        });
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Error al actualizar el pedido: ', error);
      });
  }
}
