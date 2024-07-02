import { Component, OnInit} from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { ActivatedRoute, Data, Route, Router, NavigationExtras } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Observable, map } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedir-cuenta',
  templateUrl: './pedir-cuenta.page.html',
  styleUrls: ['./pedir-cuenta.page.scss'],
})
export class PedirCuentaPage implements OnInit {
  listaPedidos: any[] = [];
  pedidoActual: any = null;
  idUsuarioActual: any;
  preciosUnitarios: any[] = [];
  isSupported = false;
  barcodes: Barcode[] = [];
  informacionQr: string | null = null;
  totalConPropina:any | null = null;
  descuento:number | null=null;
  mostrarJuego: boolean = false;
  totalConDescuento: number | null = null;
  propina: number | null = null;
  usuarioEnLista: any = null;
  constructor(
    private afAuth: AngularFireAuth,
    private database: DatabaseService,
    private router: Router, 
    private alertController: AlertController,
    private activatedRouter: ActivatedRoute

  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.idUsuarioActual = user.uid;
        this.cargarPedidos();
        this.cargarListaEspera();
      }
    });
    this.activatedRouter.queryParams.subscribe(params => {
      this.propina = parseInt(params['dato']);
      this.totalConPropina= parseInt(this.pedidoActual.montoTotal) + this.propina;
    });
  }

  calcularTotalConDescuento(){
    const descuento: number= this.pedidoActual.montoTotal * this.descuento! / 100;
    this.totalConDescuento = parseInt(this.pedidoActual.montoTotal) - descuento + this.propina!;
  }
  

  recibirDatos(datos: any) {
    this.descuento = parseInt(datos);
    if(this.descuento!= null){
      this.mostrarJuego=false;
    }
    this.calcularTotalConDescuento();
  }

  cargarPedidos() {
    const pedidosObs : Observable<any[]> = this.database.obtenerTodos('pedidos')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    pedidosObs.subscribe(data => {
      this.listaPedidos = data;
      for (let item of this.listaPedidos) {
        if (item.idCliente === this.idUsuarioActual && item.estado === "entregado-confirmado") {
          this.pedidoActual = item;
          this.preciosUnitarios = item.preciosUnitarios;
          console.log(this.pedidoActual);
          break;
        }
      }
    }); 
  }

  cargarListaEspera() {
    const listaEsperaObs : Observable<any[]> = this.database.obtenerTodos('lista-espera')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    listaEsperaObs.subscribe(data => {
      let arrayResults = data;
      for (let doc of arrayResults) {
        console.log(doc);
        if (doc.idCliente == this.idUsuarioActual && doc.estado === "asignado") {
          this.usuarioEnLista = doc;
          console.log(this.usuarioEnLista);
          break;
        }
      }
    });
  }

  async actualizarLista() {
    const listaEsperaActualizada = {
      estado: 'finalizado',
      idCliente: this.usuarioEnLista.idCliente 
    };

    await this.database.actualizar("lista-espera", listaEsperaActualizada, this.usuarioEnLista.id)
    .then(()=> console.log("Estado lista-espera actualizado"))
    .catch((error) => console.log(error)); 
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
      queryParams: { dato: parseInt(this.pedidoActual.montoTotal)}
    };

    console.log(navigationExtras);
    this.router.navigate(['qr-'+this.informacionQr!], navigationExtras);
  }

  //este metodo es para probar sin scan de qr
  ir(){

    const navigationExtras: NavigationExtras = {
      queryParams: { dato: parseInt(this.pedidoActual.montoTotal)}
    };

    console.log(navigationExtras);
    this.router.navigate(['qr-propina'], navigationExtras);
  }

  async realizarPago(){

    const pedidoActualizado={
      estado: "finalizado",
      idCliente: this.pedidoActual.idCliente,
      items: this.pedidoActual.items,
      preciosUnitarios: this.pedidoActual.preciosUnitarios,
      montoTotal: this.pedidoActual.montoTotal,
      tiempo: this.pedidoActual.tiempo,

    }
    this.database.actualizar("pedidos", pedidoActualizado, this.pedidoActual.id)
    .then(() => {
      this.actualizarLista();

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Pago realizado con éxito!",
        showConfirmButton: false,
        timer: 1500,
        heightAuto: false
      }).then(() => {
        this.router.navigateByUrl("home");
      });
    })
    .catch((error) => {
      console.error('Error al actualizar el pedido:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal. Por favor, inténtelo de nuevo.',
        heightAuto: false
      });
    });
  } //Agregar cambio en 'lista-espera', actualizar estado a 'finalizado'
}
