export class Pedido {
  idCliente: string;
  items: any[];
  montoTotal: number;
  tiempo: any;
  estado: string;
  preciosUnitarios: any[];
  confirmacionMozo: boolean;
  itemPlatos: any[];
  itemBebidas: any[];
  fecha: any;
  confirmacionCocinero: boolean;
  confirmacionBartender: boolean;
  terminoCocinero: boolean;
  terminoBartender: boolean;

  constructor(
    idCliente: string,
    items: any[],
    itemPlatos: any[],
    itemBebidas: any[],
    montoTotal: number,
    tiempo: any,
    estado: string,
    preciosUnitarios: any[],
    confirmacionMozo: boolean,
    fecha: any
  ) {
    this.idCliente = idCliente;
    this.items = items;
    this.montoTotal = montoTotal;
    this.tiempo = tiempo;
    this.estado = estado;
    this.preciosUnitarios = preciosUnitarios;
    this.confirmacionMozo = confirmacionMozo;
    this.itemBebidas = itemBebidas;
    this.itemPlatos = itemPlatos;
    this.fecha = fecha;
    this.confirmacionCocinero = false; // Inicialmente false
    this.confirmacionBartender = false; // Inicialmente false
    this.terminoCocinero = false; // Inicialmente false
    this.terminoBartender = false; // Inicialmente false
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
      fecha: this.fecha,
      confirmacionCocinero: this.confirmacionCocinero,
      confirmacionBartender: this.confirmacionBartender,
      terminoCocinero: this.terminoCocinero,
      terminoBartender: this.terminoBartender,
    };
  }
}
