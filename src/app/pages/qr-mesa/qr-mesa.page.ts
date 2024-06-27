import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2'
import { first } from 'rxjs';
@Component({
  selector: 'app-qr-mesa',
  templateUrl: './qr-mesa.page.html',
  styleUrls: ['./qr-mesa.page.scss'],
})
export class QrMesaPage implements OnInit {

  constructor(private router: Router, private database:DatabaseService, private afAuth:AngularFireAuth) { }
  pedidos:any[]=[];
  uidUsuarioActual:any;
  pedidoDelUsuario:any;
  mesas:any[]=[];
  mesaLibre:any;
  uidMesaLibre:any;
  listaEspera:any[]=[];
  clienteEnEspera:boolean=false;
  usuarioVinculado:boolean=true;

  ngOnInit() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uidUsuarioActual = user.uid;
        console.log('User UID:', this.uidUsuarioActual);
      } else {
        console.log('No user is logged in');
      }
    });

    const pedidosObservable: Observable<any[]> = this.database.obtenerTodos('pedidos')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    pedidosObservable.subscribe(data => {
      this.pedidos = data;
      this.pedidos.forEach(item => {
        if (item.idCliente == this.uidUsuarioActual && item.estado != 'finalizado') {
          this.pedidoDelUsuario = item;
          console.log(this.pedidoDelUsuario);
        } 
      });
    }, error => {
      console.log(error);
    });

  }

  redireccionar(path:string){
    this.router.navigateByUrl(path);
  }

  mostrarPedido(){

    Swal.fire({
      title: "Su pedido se encuentra:",
      html: `<div style="font-weight: bold; font-size: 1.2em;">${this.pedidoDelUsuario.estado}</div>`,
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: 'var(--ion-color-primary)',
      heightAuto: false
    });

  }

  verificarMesaLibre(): Promise<void> {
    return new Promise((resolve, reject) => {
      const mesasObservable: Observable<any[]> = this.database.obtenerTodos('mesas')!.pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id; // Este es el id del documento en la base de datos
          return { id, ...data }; // Combinamos el id con el resto de los datos
        })),
        first() // Completa el observable después de la primera emisión
      );
  
      mesasObservable.subscribe(data => {
        this.mesas = data;
        console.log(this.mesas);
        for (let item of this.mesas) {
          if (item.estado == 'libre') {
            this.mesaLibre = item;
            this.uidMesaLibre = item.id; // Asigna el id de la mesa libre a this.uidMesaLibre
            console.log(this.mesaLibre.numeroMesa);
            break; 
          }
        }
        console.log(this.mesaLibre);
        console.log(this.uidMesaLibre); // Verificar que uidMesaLibre se asignó correctamente
        resolve(); // Resuelve la promesa cuando se haya asignado mesaLibre
      }, error => {
        console.log(error);
        reject(error); // Rechaza la promesa en caso de error
      });
    });
  }

  async vincularMesa() {
    try {
      await this.verificarMesaLibre();
      const clienteEnEspera = await this.verificarClienteEnEspera();
      await this.verificarUsuarioVinculado();

      if(!this.usuarioVinculado){
      if (clienteEnEspera) {
        console.log(this.uidUsuarioActual, this.mesaLibre);
  
        if (this.uidUsuarioActual != "" && this.mesaLibre != undefined) {
          const nuevaMesa = {
            idCliente: this.uidUsuarioActual,
            numeroMesa: this.mesaLibre.numeroMesa,
            estado: 'vigente',
          };
  
          await this.database.crear("mesa-cliente", nuevaMesa);
          console.log(this.uidMesaLibre);
          console.log(this.mesaLibre.nuevaMesa);
          const mesaActualizada = {
            estado: "ocupada",
            numeroMesa: this.mesaLibre.numeroMesa,
          };
          await this.database.actualizar("mesas", mesaActualizada, this.uidMesaLibre);
  
          // Mostrar mensaje de éxito
          Swal.fire({
            title: 'Éxito',
            text: 'Se le ha asignado la mesa: ' + this.mesaLibre.numeroMesa,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--ion-color-primary)',
            heightAuto: false
          });
        } else {
          // Mostrar mensaje de error si las condiciones iniciales no se cumplen
          Swal.fire({
            title: 'Error',
            text: 'No se puede vincular la mesa porque falta información.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--ion-color-primary)',
            heightAuto: false
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Antes de tomar una mesa debe anotarse en la lista de espera.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--ion-color-primary)',
          heightAuto: false
        });
      }
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Usted ya se encuentra vinculado a una mesa.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'var(--ion-color-primary)',
        heightAuto: false
      });
    }
    } catch (error) {
      // Mostrar mensaje de error en caso de que verificarMesaLibre falle
      Swal.fire({
        title: 'Error',
        text: `Hubo un problema al verificar la mesa`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'var(--ion-color-primary)',
        heightAuto: false
      });
    }
  }
  
  async mostrarMesasLibres() {
    await this.verificarMesaLibre();
    // Filtrar las mesas con estado "libre"
    const mesasLibres = this.mesas.filter(mesa => mesa.estado === 'libre');
  
    console.log(this.mesas);

    console.log(mesasLibres);
    // Construir el contenido HTML para el SweetAlert
    let contenidoHTML = '<ul style="text-align: left; padding-left: 20px;">';
    mesasLibres.forEach(mesa => {
      contenidoHTML += `<li>Mesa número: ${mesa.numeroMesa}</li>`;
    });
    contenidoHTML += '</ul>';
  
    // Mostrar el SweetAlert con las mesas libres
    Swal.fire({
      title: "Mesas Libres",
      html: contenidoHTML,
      icon: "info",
      confirmButtonText: "Aceptar",
      confirmButtonColor: 'var(--ion-color-primary)',
      heightAuto: false
    });
  }

  async verificarClienteEnEspera() {
    return new Promise((resolve, reject) => {
      const listaEsperaObservable: Observable<any[]> = this.database.obtenerTodos('lista-espera')!.pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  
      listaEsperaObservable.subscribe(data => {
        this.listaEspera = data;
        this.clienteEnEspera = false; // Reiniciar el estado del cliente en espera
        this.listaEspera.forEach(item => {
          if (item.idCliente == this.uidUsuarioActual && item.estado == 'pendiente') {
            this.clienteEnEspera = true;
          }
        });
        resolve(this.clienteEnEspera);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  verificarUsuarioVinculado(): Promise<void> {
    return new Promise((resolve, reject) => {
      const usuarioVinculadoObservable: Observable<any[]> = this.database.obtenerTodos('mesa-cliente')!.pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id; // Este es el id del documento en la base de datos
          return { id, ...data }; // Combinamos el id con el resto de los datos
        })),
        first() // Completa el observable después de la primera emisión
      );
  
      usuarioVinculadoObservable.subscribe(data => {
        const usuariosEnMesas = data;
        this.usuarioVinculado = usuariosEnMesas.some(usuario => usuario.estado == "vigente");
        resolve(); // Resuelve la promesa después de verificar todos los usuarios
      }, error => {
        console.log(error);
        reject(error); // Rechaza la promesa en caso de error
      });
    });
  }
  
}
