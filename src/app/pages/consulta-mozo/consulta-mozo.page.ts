import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable, map } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';

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
  usuarios:any[]=[];
  consultas:any[]=[];
  idConsulta:string="";
  consultasDelUsuario:any = [];
  perfilUsuarioActual:string="";
  mesasVigentes:any[]=[];
  consultaActual:any;


  constructor(
    private authService: AuthService,
    private database: DatabaseService,
    private notificationSvc: NotificationService
  ) {}


  ngOnInit() {
    this.usuarioLogeado = this.authService.loggedUser;

    //obtengo las mesas que se encuentran actualmente con comensales, busco estado==vigente
    const numerosMesas: Observable<any[]> = this.database.obtenerTodos('mesa-cliente')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    numerosMesas.subscribe(
      data => {
        const mesas = data;
        console.log(mesas);

        mesas.forEach(item => {
          if (item.estado === 'vigente') {
            this.mesasVigentes.push(item);
          }
        });
        console.log(this.mesasVigentes);
      },
      error => {
        console.log(error);
      }
    );


    const consultasObservable: Observable<any[]> = this.database.obtenerTodos('consultas')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))

    );

    consultasObservable.subscribe(data => {
      const mesas = data;
      this.consultas=data;
    }, error => {
      console.log(error);
    });

    //obtengo perfil del usuario actualmente loggeado
    const usuarios: Observable<any[]> = this.database.obtenerTodos('usuarios')!.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    usuarios.subscribe(data => {
      this.usuarios = data;
      const usuarioEncontrado = this.usuarios.find(item => item.email == this.usuarioLogeado.email);
      if (usuarioEncontrado) {
        this.perfilUsuarioActual = usuarioEncontrado.perfil;
      }else{

        const menuObservable: Observable<any[]> = this.database.obtenerTodos('consultas')!.pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );

        if(!this.perfilUsuarioActual) {
          this.mostrarChat=true;
          this.perfilUsuarioActual= "Cliente";
          console.log(this.perfilUsuarioActual);
          menuObservable.subscribe(data => {
            this.consultas = data;
            console.log(this.consultas);
            console.log(this.usuarioLogeado.uid);
            this.consultas.forEach(item => {
              if (item.idCliente == this.usuarioLogeado.uid) {
                this.consultasDelUsuario = item.consultas?.mensajes || [];  // Inicializa como un array si está indefinido
                console.log(this.consultasDelUsuario);
                this.idConsulta = item.id;
                this.consultaActual= item;
                console.log("Id de la consulta", item.id);
                return;
              }
            });
          }, error => {
            console.log(error);
          });
        }
      }
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
        this.notificationSvc.sendNotificationToRole('Nueva consulta realizada!', mensaje.texto, 'Mozo').subscribe(
          response => console.log('Notificación a Mozo enviada con éxito', response),
          error => console.error('Error al enviar notificación a Mozo', error)
        );
      }).catch(error => {
        console.log('Error al crear el documento:', error);
      });
    } else {
      this.consultasDelUsuario.push(mensaje);

      const actualizacionConsulta = {
        idCliente: this.consultaActual.idCliente,
        consultas: {
          mensajes: this.consultasDelUsuario
        }
      };

      this.database.actualizar('consultas', actualizacionConsulta, this.idConsulta).then(() => {
        console.log('Documento actualizado.');
        this.scrollToTheLastItem();
        this.notificationSvc.sendNotificationToRole('Nueva consulta realizada!', mensaje.texto, 'Mozo').subscribe(
          response => console.log('Notificación a Mozo enviada con éxito', response),
          error => console.error('Error al enviar notificación a Mozo', error)
        );
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

  vincularChatConConsultaDelUsuario(mesaSeleccionada:any){
    this.consultas.forEach(item => {
      if (item.idCliente == mesaSeleccionada.idCliente) {
        this.consultasDelUsuario = item.consultas?.mensajes || [];  // Inicializa como un array si está indefinido
        console.log(this.consultasDelUsuario);
        this.idConsulta = item.id;
        this.consultaActual=item;
        console.log("Id de la consulta", item.id);
        return;
      }
    });

    this.mostrarChat=true;
  }
}
