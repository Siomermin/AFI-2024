export class DuenioSupervisor {
    nombre: string;
    apellido:string;
    dni:string;
    cuil:string;
    fotoUrl:any;
    perfil:string;


    constructor(nombre:string, apellido: string,dni:string, cuil: string, fotoUrl: any, perfil: string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.cuil = cuil;
        this.fotoUrl = fotoUrl;
        this.perfil = perfil;  
    }

    toJSON() {
        return {
          nombre: this.nombre,
          apellido: this.apellido,
          dni: this.dni,
          cuil: this.cuil,
          fotoUrl: this.fotoUrl,
          perfil: this.perfil,

        };
    }
}
