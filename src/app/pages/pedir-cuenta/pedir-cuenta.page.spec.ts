import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedirCuentaPage } from './pedir-cuenta.page';

describe('PedirCuentaPage', () => {
  let component: PedirCuentaPage;
  let fixture: ComponentFixture<PedirCuentaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PedirCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
