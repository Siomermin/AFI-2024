import { Component, OnInit, ViewChildren, Output, EventEmitter} from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { QueryList, ElementRef } from '@angular/core';
@Component({
  selector: 'app-memo-test',
  templateUrl: './memo-test.component.html',
  styleUrls: ['./memo-test.component.scss'],
})
export class MemoTestComponent  implements OnInit {


  @ViewChildren('imagenElemento') imagenElementos!: QueryList<ElementRef>;
  @Output() datosEnviados = new EventEmitter<number>();

  constructor(private router: ActivatedRoute, public route : Router, public database : DatabaseService, private afAuth : AngularFireAuth) {}

  public dificultad: string = "";
  public arrayImagenes: string[] = [];
  private frutas: string[] = ['salchicha', 'sanguche', 'lata', 'hamburguesa', 'chorizo', 'gaseosa', 'helado', 'salsa', 'salchicha', 'sanguche', 'lata', 'hamburguesa', 'chorizo', 'gaseosa', 'helado', 'salsa'];
  private paresAcertados = 0;
  public seleccionRonda: number = 0;

  private cronometro: any;
  public primeraImagen: string = "";
  public segundaImagen: string = "";
  bloquearImagen: boolean = false;

  public segundos = 40;
  public minutos = 0;
  public gano: boolean = false;
  public indiceAnterior: number = -1;
  elementosImg: HTMLImageElement[] = [];
  private userEmail: string | null = "";

  
  descuento = 0;
  colSize: string = "";
  colHeight: string = "";

  ngOnInit() {
    this.seleccionarImagenesAleatorias();

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
      } else {
        console.log("null");
      }
    });

    this.updateLayout();
  }


  enviarDatos() {
    this.datosEnviados.emit(this.descuento);
  }

  updateLayout() {
    switch (this.dificultad) {
      case 'facil':
        this.colSize = '6';
        this.colHeight = '25vh';
        break;
      case 'medio':
        this.colSize = '6';
        this.colHeight = '15vh';
        break;
      case 'dificil':
        this.colSize = '3';
        this.colHeight = '15vh';
        break;
      default:
        this.colSize = '3';
        this.colHeight = '15vh';
    }
  }

  ngAfterViewInit() {
    this.imagenElementos.forEach((elemento: ElementRef) => {
      this.elementosImg.push(elemento.nativeElement as HTMLImageElement);
    });

    Swal.fire({
      html: '<br><label style="font-size:80%">Estás listo para comenzar?</label>',
      confirmButtonText: "Siii",
      confirmButtonColor: 'var(--ion-color-primary)',
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.iniciarCronometro();
      }
    });
  }

  iniciarCronometro() {
    this.cronometro = setInterval(() => {
      if (this.segundos === 0 && this.minutos === 0) {
        this.gano = false;
        clearInterval(this.cronometro);
        this.mostrarResultado();
      } else {
        if (this.segundos === 0) {
          this.minutos--;
          this.segundos = 59;
        } else {
          this.segundos--;
        }
      }
    }, 1000);
  }

  seleccionarImagenesAleatorias() {
    let cantidadElementos: number = 16;
    let array = this.frutas;

    const indicesGenerados: number[] = []; 
    const arrayAux: string[] = [];
    
    while (arrayAux.length < cantidadElementos) {
      const indiceAleatorio = Math.floor(Math.random() * cantidadElementos);
      if (!indicesGenerados.includes(indiceAleatorio)) {
        indicesGenerados.push(indiceAleatorio);
        arrayAux.push(array[indiceAleatorio]);
      }
    }

    indicesGenerados.forEach(indice => {
      this.arrayImagenes.push(arrayAux[indice]);
    });
  }

  seleccionarImagen(nombreImagen: string, indice: number) {
    this.seleccionRonda++;

    this.elementosImg[indice].src = `../../assets/juego/comida/${this.dificultad}/${nombreImagen}.png`;

    if (this.seleccionRonda === 1) {
      this.primeraImagen = nombreImagen;
      this.indiceAnterior = indice;
    } else if (this.seleccionRonda === 2) {
      this.bloquearImagen = true;
      this.segundaImagen = nombreImagen;

      if (this.primeraImagen === this.segundaImagen) {
        this.paresAcertados++;
        this.bloquearImagen = false;
      } else {
        setTimeout(() => {
          this.elementosImg[indice].src = `../../../assets/images/q.png`;
          this.elementosImg[this.indiceAnterior].src = `../../../assets/images/q.png`;
          this.bloquearImagen = false;
        }, 1000);
      }
      this.seleccionRonda = 0;
    }

    if (this.paresAcertados == this.arrayImagenes.length / 2) {
      this.gano = true;
      clearInterval(this.cronometro);
      this.mostrarResultado();
    }
  }

  mostrarResultado() {
    if (this.gano) {
      this.descuento = 10;
    }
    
    let mensaje = this.gano ? "Has ganado el juego! Y obtuviste un 10% de descuento" : "Se acabó el tiempo!";
    
    Swal.fire({
      html: `<br><label style="font-size:80%">${mensaje}</label><br>`,
      confirmButtonText: "Entendido!",
      confirmButtonColor: 'var(--ion-color-primary)',
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.enviarDatos(); // Aquí se llama al evento enviarDatos()
      }
    });
  }

  generateRows(array: any[]): any[][] {
    const rows = [];
    for (let i = 0; i < array.length; i += 6) {
      rows.push(array.slice(i, i + 6));
    }
    return rows;
  }

  abandonar() {
    clearInterval(this.cronometro);
    Swal.fire({
      title: "Has abandonado el juego!",
      imageUrl: "../../assets/img/medio.png",
      imageWidth: 130,
      imageHeight: 100,
      heightAuto: false,
      confirmButtonText: "Ir al Menú!",
      confirmButtonColor: 'var(--ion-color-primary)',
    }).then((result) => {
      if (result.isConfirmed) {
        this.route.navigateByUrl('home');
      }
    });
  }
}