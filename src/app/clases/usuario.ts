export class Usuario {

    email: string;
    clave:string;
    perfil:string;

   
    constructor(email:string, clave:string, perfil:string) {
        this.email = email;
        this.clave = clave;
        this.perfil = perfil;
     
    }
}