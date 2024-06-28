import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.page.html',
  styleUrls: ['./gestion-clientes.page.scss'],
})
export class GestionClientesPage implements OnInit {

  constructor(private database:DatabaseService) { }

  clientes:any[]=[];
  idUsuarioSeleccionado:any;

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
      this.clientes = data;
      console.log(this.clientes);
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
          await this.enviarCorreoElectronico(clienteSeleccionado.nombre, 'Aceptada', clienteSeleccionado.email);
        } else {
          nuevoEstado = 'rechazado';
          await this.enviarCorreoElectronico(clienteSeleccionado.nombre, 'Rechazada', clienteSeleccionado.email);
        }

        const clienteActualizado = new Cliente(
          clienteSeleccionado.nombre,
          clienteSeleccionado.apellido,
          clienteSeleccionado.dni,
          clienteSeleccionado.fotoUrl,
          clienteSeleccionado.email,
          clienteSeleccionado.clave,
          nuevoEstado,
          clienteSeleccionado.anonimo,
          clienteSeleccionado.fotoUrl
        );

        await this.database.actualizar("clientes", clienteActualizado.toJSON(), idUsuarioSeleccionado);

        console.log('Cliente actualizado con éxito.');
      } else {
        console.log('No se pudo encontrar el cliente para actualizar.');
      }
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
    }
  }

  async enviarCorreoElectronico(nombreCliente: string, estado: string, emailCliente: string) {
    emailjs.init('GDS9E7Y2LFxVYkFeh');

    const res = await emailjs.send('service_2hoxsd5', 'template_wh08x79', {
      nombre_cliente: nombreCliente,
      estado: estado,
      email_cliente: emailCliente
    });
    console.log('Respuesta:');
    console.log(res);
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
