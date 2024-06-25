import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
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

    const menuObservable: Observable<any[]> = this.database.obtenerTodos('clientes')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    menuObservable.subscribe(data => {
      this.clientes = data;
      console.log(this.clientes);
    }, error => {
      console.log(error);
    });


  }

  async gestionarSolicitud(clienteSeleccionado: any) {
    try {
      const idUsuarioSeleccionado = await this.obtenerIdClienteSeleccionado(clienteSeleccionado.dni);
      if (idUsuarioSeleccionado) {
        const clienteActualizado = new Cliente(
          clienteSeleccionado.nombre, 
          clienteSeleccionado.apellido, 
          clienteSeleccionado.dni,
          clienteSeleccionado.fotoUrl,
          clienteSeleccionado.email, 
          clienteSeleccionado.clave, 
          "autorizado"
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
