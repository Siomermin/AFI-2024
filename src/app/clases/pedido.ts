export class Pedido {

    idCliente: string;
    items:any[];
    montoTotal:number;
    tiempo:any;
    estado:string;
    preciosUnitarios:any[];



    constructor(idCliente:string, items:any[], montoTotal:number, tiempo: any, estado: string, preciosUnitarios:any[]) {
        this.idCliente = idCliente;
        this.items = items;
        this.montoTotal = montoTotal;
        this.tiempo = tiempo;
        this.estado = estado;  
        this.preciosUnitarios = preciosUnitarios


    }


    toJSON() {
        return {
         idCliente: this.idCliente,
         items: this.items,
         montoTotal: this.montoTotal,
         tiempo: this.tiempo,
         estado: this.estado,
         precioUnitarios: this.preciosUnitarios



        };
    }


}