import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})
export class ListaEsperaPage implements OnInit {

  public arrayListaEspera : Array<any> = [];
  public arrayClientes : Array<any> = [];
  public arrayAuthUsers : Array<any> = [];

  constructor(private database: DatabaseService) { }

  ngOnInit() {


    this.cargarClientesEnEspera();
    this.cargarClientes();
  }

  cargarClientes() {
    const clientesObservable : Observable<any[]> = this.database.obtenerTodos('clientes')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    clientesObservable.subscribe(next => {
      this.arrayClientes = [];
      let result = next;
      result.forEach(cliente => {

        if(cliente.id) {
          this.arrayClientes.push(cliente);
        }
      });
    });
  }

  cargarClientesEnEspera() {
    const listaEsperaObservable : Observable<any[]> = this.database.obtenerTodos('lista-espera')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    listaEsperaObservable.subscribe(next => {
      this.arrayListaEspera = [];
      let result = next;
      result.forEach(cliente => {
        console.log(cliente);
        if(cliente.estado == "pendiente") {
          this.arrayListaEspera.push(cliente);
        }
      });
    });
  }
}
