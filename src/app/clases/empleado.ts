export class Empleado {
    nombre: string;
    apellido:string;
    dni:number;
    cuil:number;
    fotoUrl:string;
    tipoEmpleado:string;


    constructor(nombre:string, apellido: string,dni:number, cuil: number, fotoUrl: string, tipoEmpleado: string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.cuil = cuil;
        this.fotoUrl = fotoUrl;
        this.tipoEmpleado = tipoEmpleado;  
    }
}
