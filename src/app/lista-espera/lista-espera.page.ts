import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})
export class ListaEsperaPage implements OnInit {

  idUsuarioSeleccionado : string = '';
  clientesEnEspera : Array<any> = [];

  constructor(private database:DatabaseService) { }

  ngOnInit() {
    this.cargarClientesEnEspera();
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
      this.clientesEnEspera = [];
      let result = next;
      result.forEach(cliente => {
        console.log(cliente);
        if(cliente.estado == "pendiente"){
          this.clientesEnEspera.push(cliente);
        }
      });
    });
  }
}
