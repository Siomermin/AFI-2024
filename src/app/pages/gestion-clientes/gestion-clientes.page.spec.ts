import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionClientesPage } from './gestion-clientes.page';

describe('GestionClientesPage', () => {
  let component: GestionClientesPage;
  let fixture: ComponentFixture<GestionClientesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GestionClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
