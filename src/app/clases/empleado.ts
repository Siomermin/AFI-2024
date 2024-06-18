export class Empleado {
    nombre: string;
    apellido:string;
    dni:string;
    cuil:string;
    fotoUrl:any;
    tipoEmpleado:string;


    constructor(nombre:string, apellido: string,dni:string, cuil: string, fotoUrl: any, tipoEmpleado: string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.cuil = cuil;
        this.fotoUrl = fotoUrl;
        this.tipoEmpleado = tipoEmpleado;  
    }


    toJSON() {
        return {
          nombre: this.nombre,
          apellido: this.apellido,
          dni: this.dni,
          cuil: this.cuil,
          fotoUrl: this.fotoUrl,
          tipoEmpleado: this.tipoEmpleado,

        };
    }
}

