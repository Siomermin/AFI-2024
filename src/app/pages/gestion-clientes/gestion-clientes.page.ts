import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.page.html',
  styleUrls: ['./gestion-clientes.page.scss'],
})
export class GestionClientesPage implements OnInit {

  constructor(private database:DatabaseService, private notificationSvc: NotificationService) { }

  clientes:any[]=[];
  idUsuarioSeleccionado:any;
  clientesPendientes:any[]=[];

  ngOnInit() {

    this.cargarClientesPendientes();
  }

  cargarClientesPendientes() {
    const clientesPendientesObservable: Observable<any[]> = this.database.obtenerClientesPendientes()!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    clientesPendientesObservable.subscribe(data => {
      this.clientesPendientes = [];
      this.clientes = data;
      this.clientes.forEach( cliente => {
        if(cliente.estado == "pendiente"){
          this.clientesPendientes.push(cliente);
        }
      })
    }, error => {
      console.log(error);
    });
  }



async gestionarSolicitud(clienteSeleccionado: any, autorizar: boolean) {
  try {
    const idUsuarioSeleccionado = await this.obtenerIdClienteSeleccionado(clienteSeleccionado.dni);
    if (idUsuarioSeleccionado) {
      let nuevoEstado = '';

      if (autorizar) {
        nuevoEstado = 'autorizado';
      } else {
        nuevoEstado = 'rechazado';
      }

      const clienteActualizado = new Cliente(
        clienteSeleccionado.nombre,
        clienteSeleccionado.apellido,
        clienteSeleccionado.dni,
        clienteSeleccionado.email,
        clienteSeleccionado.clave,
        nuevoEstado,
        clienteSeleccionado.anonimo,
        clienteSeleccionado.urlFoto,
        clienteSeleccionado.perfil
      );

      console.log(clienteActualizado)
      console.log(clienteActualizado.toJSON(), idUsuarioSeleccionado);
      await this.database.actualizar("clientes", clienteActualizado.toJSON(), idUsuarioSeleccionado);

      // Llamar a sendMail con el estado de autorización adecuado
      this.notificationSvc.sendMail(autorizar, clienteSeleccionado.nombre, clienteSeleccionado.email)
        .subscribe({
          next: (response) => {
            console.log('Correo enviado con éxito:', response);
          },
          error: (error) => {
            console.error('Error al enviar el correo:', error);
          }
        });

      console.log('Cliente actualizado con éxito.');
    } else {
      console.log('No se pudo encontrar el cliente para actualizar.');
    }
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
  }
}

  obtenerIdClienteSeleccionado(clienteSeleccionadoDni: any): Promise<string | null> {
    const clientesObservable: Observable<any[]> = this.database.obtenerTodos('clientes')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    return new Promise((resolve, reject) => {
      clientesObservable.subscribe(data => {
        const clienteEncontrado = data.find(cliente => cliente.dni == clienteSeleccionadoDni);
        if (clienteEncontrado) {
          console.log('ID del cliente encontrado:', clienteEncontrado.id);
          resolve(clienteEncontrado.id);
        } else {
          console.log('Cliente con DNI', clienteSeleccionadoDni, 'no encontrado.');
          resolve(null);
        }
      }, error => {
        console.log('Error obteniendo los clientes:', error);
        reject(error);
      });
    });
  }
}
