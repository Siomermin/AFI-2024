export class Cliente {


    nombre: string;
    apellido:string;
    dni:string;
    fotoUrl:any;
    email:string;
    clave:string;
    estado:string;


    constructor(nombre:string, apellido: string,dni:string, fotoUrl: any, email: string, clave:string, estado:string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.fotoUrl = fotoUrl;
        this.email = email;  
        this.clave = clave; 
        this.estado = estado;

    }


    toJSON() {
        return {
          nombre: this.nombre,
          apellido: this.apellido,
          dni: this.dni,
          fotoUrl: this.fotoUrl,
          email: this.email,
          clave: this.clave,
          estado: this.estado


        };
    }


}
