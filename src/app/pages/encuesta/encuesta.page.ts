import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable,map } from 'rxjs';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  encuestaForm: FormGroup;

  constructor(private database: DatabaseService, private afAuth: AngularFireAuth, private router: Router,private fb: FormBuilder) // Añadido FormBuilder
{    this.encuestaForm = this.fb.group({
      valoracionPlatos: ['', [Validators.required]],
      valoracionAtencion: ['', Validators.required],
      caracteristicas: this.fb.array([], Validators.required),
      valoracionPersonal: ['', [Validators.required]],
    });
  }

  listaMesaCliente: any[]=[];
  uidUsuarioActual:any;
  encuestasDelUsuario:any;
  encuestasIncompletasDelUsuario:any[]=[];
  mostrarFormEncuesta:boolean=false;
  encuestaSeleccionada:any;
 
  

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


  onCheckboxChange(event: any, value: string) {
    const caracteristicas: FormArray = this.encuestaForm.get('caracteristicas') as FormArray;

    if (event.target.checked) {
      caracteristicas.push(new FormControl(value));
    } else {
      const index = caracteristicas.controls.findIndex(x => x.value === value);
      caracteristicas.removeAt(index);
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
    if (this.encuestaForm.valid) {
      const nuevaEncuesta = {
        valoracionPlatos: this.encuestaForm.get('valoracionPlatos')?.value,
        valoracionAtencion: this.encuestaForm.get('valoracionAtencion')?.value,
        valoracionPersonal: this.encuestaForm.get('valoracionPersonal')?.value,
        caracteristicas: this.encuestaForm.get('caracteristicas')?.value as string[],
      };
  
      console.log(nuevaEncuesta);
  
      this.database.crear("encuestas", nuevaEncuesta)
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
            heightAuto: false
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
            heightAuto: false
          });
        });
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        heightAuto: false
      });
    }
  }


}
