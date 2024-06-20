import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vincular-mesa',
  templateUrl: './vincular-mesa.page.html',
  styleUrls: ['./vincular-mesa.page.scss'],
})
export class VincularMesaPage implements OnInit {

  uidUsuarioActual:string="";
  mesas:any[]=[];
  mesaLibre:any;
  constructor(private afAuth: AngularFireAuth, private database: DatabaseService) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uidUsuarioActual = user.uid;
        console.log('User UID:', this.uidUsuarioActual);
      } else {
        console.log('No user is logged in');
      }
    });
  }

  verificarMesaLibre(){
    const mesasObservable: Observable<any[]> = this.database.obtenerTodos('mesas')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    mesasObservable.subscribe(data => {
      this.mesas = data;
      this.mesas.forEach(item => {
        if (item.estado == "libre") {
          this.mesaLibre.push(item);
        } 
      });
    }, error => {
      console.log(error);
    });

  }
  vincularMesa(){
    if(this.uidUsuarioActual!= "" && this.mesaLibre!=undefined){
      const nuevaMesa = {
        idCliente: this.uidUsuarioActual,
        numeroMesa: this.mesaLibre.numeroMesa,
        timestamp: new Date().toISOString()  // Usar ISO string para la fecha
      };
      this.database.crear("mesas", nuevaMesa);
    }

  }


}
