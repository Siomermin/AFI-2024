import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable,map } from 'rxjs';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  @ViewChild('encuestaForm', { static: false }) encuestaForm?: NgForm;

  constructor(private database: DatabaseService, private afAuth: AngularFireAuth, private router: Router) { }

  listaMesaCliente: any[]=[];
  uidUsuarioActual:any;
  encuestasDelUsuario:any;
  encuestasIncompletasDelUsuario:any[]=[];
  mostrarFormEncuesta:boolean=false;
  encuestaSeleccionada:any;
 
  encuesta = {
    valoracionPlatos: 3,
    valoracionAtencion: '',
    caracteristicas: [] as string[],
    valoracionPersonal: ''
  };

  ngOnInit() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uidUsuarioActual = user.uid;
        console.log('User UID:', this.uidUsuarioActual);
      } else {
        console.log('No user is logged in');
      }
    });

    const mesaCliente: Observable<any[]> = this.database.obtenerTodos('mesa-cliente')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    mesaCliente.subscribe(data => {
      this.listaMesaCliente = data;
      console.log(this.listaMesaCliente);
      this.listaMesaCliente.forEach(item => {
        if (item.idCliente == this.uidUsuarioActual && item.encuestaCompleta == false) {
          this.encuestasIncompletasDelUsuario.push(item);
        } 
      });
      console.log(this.encuestasIncompletasDelUsuario);
    }, error => {
      console.log(error);
    });
  }



  onCheckboxChange(event: any, value: any) {
    if (event.detail.checked) {
      this.encuesta.caracteristicas.push(value);
    } else {
      const index = this.encuesta.caracteristicas.indexOf(value);
      if (index > -1) {
        this.encuesta.caracteristicas.splice(index, 1);
      }
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    
    // Formatear la fecha
    const fecha = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  
    // Formatear la hora
    const hora = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  
    return `${fecha} - ${hora}`;
  }

  habilitarEncuesta(item:any){
    this.mostrarFormEncuesta=true;
    this.encuestaSeleccionada=item;

  }


  onSubmit() {
    if (this.encuestaForm?.valid) {
      console.log(this.encuesta);

      this.database.crear("encuestas", this.encuesta)
        .then(() => {
          const dataActualizada = {
            encuestaCompleta: "true",
            estado: this.encuestaSeleccionada.estado,
            fecha: this.encuestaSeleccionada.fecha,
            idCliente: this.encuestaSeleccionada.idCliente,
            numeroMesa: this.encuestaSeleccionada.numeroMesa
          };

          return this.database.actualizar("mesa-cliente", dataActualizada, this.encuestaSeleccionada.id);
        })
        .then(() => {
          Swal.fire({
            title: 'Éxito',
            text: 'Encuesta enviada con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            heightAuto:false
          }).then(() => {
            this.router.navigate(['/qr-mesa']);
          });
        })
        .catch(error => {
          console.error("Error al procesar la encuesta:", error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al enviar la encuesta. Por favor, inténtelo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            heightAuto:false

          });
        });
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        heightAuto:false
 
      });
    }
  }


}
