import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
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
  private obsLista:  = null;

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

    if(this.uidUsuarioActual != '') {

    }
  }

  //Estaría bueno evitar que un usuario no cliente se añada a la lista de espera, debería haber una variable 'perfil' cargada en un servicio (a discutir con el equipo).

  redireccionar(path : string) {
    this.router.navigateByUrl(path);
  }


}
