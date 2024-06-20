import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-propina',
  templateUrl: './qr-propina.page.html',
  styleUrls: ['./qr-propina.page.scss'],
})
export class QrPropinaPage {

  private router = inject(Router);
  nivelSatisfaccionSeleccionado?: number;
  totalCuenta?: number = 100;
  propinaCalculada: number | null = null;
  totalConPropinaCalculada: number | null = null;

  constructor() {}

  redireccionar(path: string) {
    this.router.navigateByUrl(path);
  }

  calcularPropina() {
    if (this.totalCuenta && this.nivelSatisfaccionSeleccionado !== undefined) {
      this.propinaCalculada = (this.totalCuenta * this.nivelSatisfaccionSeleccionado) / 100;
      this.totalConPropinaCalculada = this.totalCuenta + this.propinaCalculada;
    } else {
      this.propinaCalculada = null;
      this.totalConPropinaCalculada = null;
    }
  }

  enviarPropina() {
    if (this.totalCuenta && this.nivelSatisfaccionSeleccionado !== undefined && this.propinaCalculada !== null && this.totalConPropinaCalculada !== null) {
      console.log('Propina enviada:', this.propinaCalculada);
      console.log('Total con propina:', this.totalConPropinaCalculada);
      this.redireccionar('/home');
    } else {
      console.error('Por favor, ingrese el total de la cuenta y seleccione un nivel de satisfacción.');
    }
  }
}
