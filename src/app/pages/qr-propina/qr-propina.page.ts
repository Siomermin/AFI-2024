import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-qr-propina',
  templateUrl: './qr-propina.page.html',
  styleUrls: ['./qr-propina.page.scss'],
})
export class QrPropinaPage implements OnInit {

  private router = inject(Router);
  nivelSatisfaccionSeleccionado?: number;
  totalCuenta: number | null = null;
  propinaCalculada: number | null = null;
  totalConPropinaCalculada: number | null = 0;

  constructor(private activatedRouter: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe(params => {
      if (params['dato']) {
        this.totalCuenta = parseInt(params['dato']); // Convertir a número
      }
    });

    console.log(this.totalCuenta);
  }

  calcularPropina() {
    if (this.totalCuenta !== null && this.nivelSatisfaccionSeleccionado !== undefined) {
      this.propinaCalculada = (this.totalCuenta * this.nivelSatisfaccionSeleccionado) / 100;

      this.totalConPropinaCalculada = this.totalCuenta + this.propinaCalculada;
      console.log(this.totalConPropinaCalculada);
    } else {
      this.propinaCalculada = null;
      this.totalConPropinaCalculada = null;
    }
  }

  

  enviarPropina() {
    if (this.totalCuenta && this.nivelSatisfaccionSeleccionado !== undefined && this.propinaCalculada !== null && this.totalConPropinaCalculada !== null) {
      console.log('Propina enviada:', this.propinaCalculada);
      console.log('Total con propina:', this.totalConPropinaCalculada);

      const navigationExtras: NavigationExtras = {
        queryParams: { dato: this.propinaCalculada }
      };

      this.router.navigate(['pedir-cuenta'], navigationExtras);
    } else {
      console.error('Por favor, ingrese el total de la cuenta y seleccione un nivel de satisfacción.');
    }
  }
}