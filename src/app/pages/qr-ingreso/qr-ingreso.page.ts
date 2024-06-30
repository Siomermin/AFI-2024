import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-qr-ingreso',
  templateUrl: './qr-ingreso.page.html',
  styleUrls: ['./qr-ingreso.page.scss'],
})
export class QrIngresoPage implements OnInit {

  /* QR de ingreso al local:
● Para que el cliente se pueda poner en la lista de espera.
● Para que el cliente pueda acceder a la encuesta de antiguos clientes.

  - Ingresa un cliente al local como anónimo (celular 2) y escanea el código Qr para solicitar mesa (lista de 
espera). 
❏ Verificar que aparezca en la lista de espera del Metre (celular 3). (push notification*A)
❏ Verificar que no puede tomar una mesa sin estar previamente en la lista de espera. 

  - El mozo confirma el pago y se libera la mesa.

❏ El cliente, escaneando el Qr de la lista de espera, podrá visualizar los resultados de las encuestas en 
distintos tipos de gráficos (torta, barra, lineal, etc.).
  */

  private uidUsuarioActual: string = '';
  private arrayListaEspera : Array<any> = [];
  private docEnLista : any = null;

  constructor(private router: Router, private database: DatabaseService, private auth: AngularFireAuth) { }

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.uidUsuarioActual = user.uid;
        console.log('User UID:', this.uidUsuarioActual);
      } else {
        console.log('No user is logged in');
      }
    });

    const listaEsperaObs : Observable<any[]> = this.database.obtenerTodos('lista-espera')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    listaEsperaObs.subscribe(data => {
      this.arrayListaEspera = data;
      for (let obj of this.arrayListaEspera) {
        console.log(obj);
        if (obj.idCliente == this.uidUsuarioActual) {
          this.docEnLista = obj;
          break;
        }
      }
    });
  
  }

  async agregarListaEspera() {
    if (this.uidUsuarioActual != '') {

      if (this.docEnLista != null) {
      //Si está en la lista de espera y su estado es 'finalizado', actualizo la lista de espera, sino informo al cliente
        switch (this.docEnLista.estado) {
          case 'finalizado':
            const listaEsperaActualizada = {
              estado: 'pendiente',
              idCliente: this.uidUsuarioActual 
            };
            await this.database.actualizar("lista-espera", listaEsperaActualizada, this.docEnLista.id);
            this.enviarNotificacion();
            break;
          case 'pendiente':
            Swal.fire({
              title: 'Usted ya se encuentra en la Lista de Espera',
              text: 'Por favor aguarde a ser asignado a una mesa.',
              icon: 'info',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'var(--ion-color-primary)',
              heightAuto: false
            });
            break;
          case 'asignado':
            Swal.fire({
              title: 'Error',
              text: 'Ya tiene una mesa asignada, debe escanear el QR de la misma.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'var(--ion-color-primary)',
              heightAuto: false
            });
            break;
        }
      } else {
        // Si no se encuentra en la lista de espera, lo agrego.
        const ingresoListaEspera = {
          estado: 'pendiente',
          idCliente: this.uidUsuarioActual
        }

        await this.database.crear("lista-espera", ingresoListaEspera);
        this.enviarNotificacion();
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: `No se pudo verificar la sesión actual`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'var(--ion-color-primary)',
        heightAuto: false
      });
    }
  }

  //Avisar al mozo con push notification
  enviarNotificacion() {

  }

  redireccionar(path : string) {
    this.router.navigateByUrl(path);
  }
  
  //Estaría bueno evitar que un usuario no cliente se añada a la lista de espera, debería haber una variable 'perfil' cargada en un servicio (a discutir con el equipo).

}
