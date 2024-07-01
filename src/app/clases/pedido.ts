export class Pedido {

    idCliente: string;
    items:any[];
    montoTotal:number;
    tiempo:any;
    estado:string;
    preciosUnitarios:any[];
    confirmacionMozo: boolean;


    constructor(idCliente:string, items:any[], montoTotal:number, tiempo: any, estado: string, preciosUnitarios:any[], confirmacionMozo: boolean) {
        this.idCliente = idCliente;
        this.items = items;
        this.montoTotal = montoTotal;
        this.tiempo = tiempo;
        this.estado = estado;
        this.preciosUnitarios = preciosUnitarios
        this.confirmacionMozo = confirmacionMozo;
    }


    toJSON() {
        return {
         idCliente: this.idCliente,
         items: this.items,
         montoTotal: this.montoTotal,
         tiempo: this.tiempo,
         estado: this.estado,
         preciosUnitarios: this.preciosUnitarios,
         confirmacionMozo: this.confirmacionMozo
        };
    }


}
