import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-consulta-mozo',
  templateUrl: './consulta-mozo.page.html',
  styleUrls: ['./consulta-mozo.page.scss'],
})
export class ConsultaMozoPage implements OnInit {

  @ViewChild('contenedorDeMensajes') contenedorDeMensajes!: ElementRef;

  usuarioLogeado: any;
  nuevoMensaje: string = "";
  mensajes: any[] = [];
  email: any = "";
  info: string = "";
  mostrarChat = false;
  usuarioLogeadoBool: boolean = true;
  consultaId: string = ''; // ID de la consulta actual

  consultas:any[]=[];
  idConsulta:string="";
  consultasDelUsuario:any = [];

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: ActivatedRoute,
    private database: DatabaseService
  ) {}

  
  ngOnInit() {
    this.usuarioLogeado = this.authService.loggedUser;
  
    const menuObservable: Observable<any[]> = this.database.obtenerTodos('consultas')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  
    menuObservable.subscribe(data => {
      this.consultas = data;
      console.log(this.consultas);
      console.log(this.usuarioLogeado.uid);
      this.consultas.forEach(item => {
        if (item.idCliente == this.usuarioLogeado.uid) {
          this.consultasDelUsuario = item.consultas?.mensajes || [];  // Inicializa como un array si está indefinido
          console.log(this.consultasDelUsuario);
          this.idConsulta = item.id;
          console.log("Id de la consulta", item.id);
          return;
        }
      });
    }, error => {
      console.log(error);
    });
  }

  enviarMensaje() {
    if (this.nuevoMensaje === "" || !this.usuarioLogeado || !this.usuarioLogeado.uid) return;
  
    const mensaje = {
      emisorUid: this.usuarioLogeado.uid,
      texto: this.nuevoMensaje,
      timestamp: new Date().toISOString()  // Usar ISO string para la fecha
    };
  
    console.log(mensaje);
  
    if (this.consultasDelUsuario.length === 0) {
      // Crear un nuevo documento si no existe uno para el usuario
      const nuevaConsulta = {
        idCliente: this.usuarioLogeado.uid,
        consultas: { mensajes: [mensaje] }  // Inicializar con el nuevo mensaje
      };
      this.database.crear('consultas', nuevaConsulta).then(() => {
        console.log('Nuevo documento creado.');
        this.scrollToTheLastItem();
      }).catch(error => {
        console.log('Error al crear el documento:', error);
      });
    } else {
      // Actualizar el documento existente
      this.consultasDelUsuario.push(mensaje);
      const actualizacionConsulta = {
        consultas: { mensajes: this.consultasDelUsuario },
        idCliente: this.usuarioLogeado.uid,
      };
      this.database.actualizar('consultas', actualizacionConsulta, this.idConsulta).then(() => {
        console.log('Documento actualizado.');
        this.scrollToTheLastItem();
      }).catch(error => {
        console.log('Error al actualizar el documento:', error);
      });
    }
  
    this.nuevoMensaje = "";
  }

  scrollToTheLastItem() {
    try {
      this.contenedorDeMensajes.nativeElement.scrollTop = this.contenedorDeMensajes.nativeElement.scrollHeight;
    } catch (err) { }
  }

  esUsuarioLogeado(emisorUid: string): boolean {
    return this.usuarioLogeado && this.usuarioLogeado.uid === emisorUid;
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
}

