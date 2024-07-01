import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Pedido } from 'src/app/clases/pedido';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private database:DatabaseService, private afAuth: AngularFireAuth, private router: Router) { }

  menu:any[] = [];
  idClienteActual:string="";
  pedidoParcial:any[]=[];
  pedidoCompleto:any[]=[];
  montoTotal:number=0;
  tiemposPlatos:any[]=[];
  tiempoTotalPedido:any;
  mostrarPedido:boolean=false;
  principales:any[]=[];
  bebidas:any[]=[];
  guarniciones:any[]=[];
  postres:any[]=[];
  preciosUnitarios:any[]=[];

  ngOnInit() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.idClienteActual = user.uid;
        console.log('ID del usuario actual:', this.idClienteActual);
      } else {
        console.log('No hay usuario autenticado.');
      }
    });


    const menuObservable: Observable<any[]> = this.database.obtenerTodos('menu')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    menuObservable.subscribe(data => {
      this.menu = data;
      this.menu.forEach(item => {
        if (item.tipo === "principal") {
          this.principales.push(item);
        } else if (item.tipo === "guarnicion") {
          this.guarniciones.push(item);
        } else if (item.tipo === "bebida") {
          this.bebidas.push(item);
        }else if(item.tipo =="postre"){
          this.postres.push(item);

        }
      });
    }, error => {
      console.log(error);
    });
  }

  agregarPlatoAlPedido(platoSeleccionado:string, precioPlato:string, tiempoPlato:string){
    this.pedidoParcial.push(platoSeleccionado);
    this.montoTotal+= parseInt(precioPlato);
    this.tiemposPlatos.push(parseInt(tiempoPlato));
    console.log(this.pedidoParcial);
    this.tiempoTotalPedido= Math.max(...this.tiemposPlatos);
    this.preciosUnitarios.push(precioPlato);

  }

  finalizarPedido(){
    this.pedidoCompleto = this.pedidoParcial;
    this.verificarMayorTiempo();
    const nuevoPedido= new Pedido(this.idClienteActual, this.pedidoCompleto, this.montoTotal, this.tiempoTotalPedido, "pendiente", this.preciosUnitarios, false);
    this.database.crear("pedidos", nuevoPedido.toJSON())
        .then((docRef) => {
          // Operación exitosa
          console.log("Documento escrito con ID: ", docRef.id);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Pedido creado con éxito!",
            showConfirmButton: false,
            timer: 1500,
            heightAuto:false
          });

          this.router.navigateByUrl('home');
        })
        .catch((error) => {
          // Ocurrió un error
          console.error("Error al crear el usuario:", error);

          Swal.fire({
            icon: "error",
            title: "Ocurrió un error al realizar el pedido",
            confirmButtonColor: "red",
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('home');
            }
          });


        });

  }

  verificarMayorTiempo(){

    if (this.tiemposPlatos.length === 0) {
      return 0; // O cualquier otro valor por defecto si el array está vacío
    }
    this.tiempoTotalPedido= Math.max(...this.tiemposPlatos);
    return;

  }

  verPedido(){

    let contenidoHTML = '<ul style="text-align: left; padding-left: 20px;">'; // Añadir estilo para alinear a la izquierda y pegar a las viñetas
    this.pedidoParcial.forEach(item => {
      contenidoHTML += `<li>${item}</li>`;
    });
    contenidoHTML += '</ul>';
    contenidoHTML += `<p><strong>Total: $${this.montoTotal.toFixed(2)}</strong></p>`; // Añadir el monto total debajo de la lista


    Swal.fire({
      title: "Tu pedido:",
      heightAuto: false,
      confirmButtonText: "Volver",
      confirmButtonColor: 'var(--ion-color-primary)',
      html: contenidoHTML // Aquí se inserta el contenido del array
    });

  }


}



