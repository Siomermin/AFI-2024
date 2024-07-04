import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosPendientesBarmanPage } from './pedidos-pendientes-barman.page';

describe('PedidosPendientesBarmanPage', () => {
  let component: PedidosPendientesBarmanPage;
  let fixture: ComponentFixture<PedidosPendientesBarmanPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PedidosPendientesBarmanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
