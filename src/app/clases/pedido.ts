export class Pedido {

    idCliente: string;
    items:any[];
    montoTotal:number;
    tiempo:any;
    estado:string;
    preciosUnitarios:any[];
    confirmacionMozo: boolean;
    itemPlatos:any[];
    itemBebidas:any[];
    fecha:any;
    preciosBebidas:any[];
    preciosPlatos:any[];

    constructor(idCliente:string, items:any[], itemPlatos:any[], itemBebidas:any[], montoTotal:number, tiempo: any, estado: string, preciosUnitarios:any[], confirmacionMozo: boolean, fecha:any, preciosBebidas:any[], preciosPlatos:any[]) {
        this.idCliente = idCliente;
        this.items = items;
        this.montoTotal = montoTotal;
        this.tiempo = tiempo;
        this.estado = estado;
        this.preciosUnitarios = preciosUnitarios
        this.confirmacionMozo = confirmacionMozo;
        this.itemBebidas= itemBebidas,
        this.itemPlatos=itemPlatos
        this.fecha=fecha;
        this.preciosBebidas=preciosBebidas,
        this.preciosPlatos=preciosPlatos
    }


    toJSON() {
        return {
         idCliente: this.idCliente,
         items: this.items,
         montoTotal: this.montoTotal,
         tiempo: this.tiempo,
         estado: this.estado,
         preciosUnitarios: this.preciosUnitarios,
         confirmacionMozo: this.confirmacionMozo,
         platos: this.itemPlatos,
         bebidas: this.itemBebidas,
         fecha:this.fecha,
         preciosBebidas: this.preciosBebidas,
         preciosPlatos:this.preciosPlatos,
        };
    }


}
