

export class Cliente {

  nombre: string;
  apellido:string;
  dni:string;
  fotoUrl:any;
  email:string;
  clave:string;
  estado:string;
  anonimo: boolean;
  urlFoto: string;

  constructor(nombre:string, apellido: string,dni:string, fotoUrl: any, email: string, clave:string, estado:string, anonimo: boolean, urlFoto:string) {
      this.nombre = nombre;
      this.apellido = apellido;
      this.dni = dni;
      this.fotoUrl = fotoUrl;
      this.email = email;
      this.clave = clave;
      this.estado = estado;
      this.anonimo = anonimo;
      this.urlFoto=urlFoto;
  }


  toJSON() {
      return {
        nombre: this.nombre,
        apellido: this.apellido,
        dni: this.dni,
        fotoUrl: this.fotoUrl,
        email: this.email,
        clave: this.clave,
        estado: this.estado,
        anonimo: this.anonimo,
        urlFoto: this.urlFoto,
      };
  }


}
