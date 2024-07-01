import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrIngresoPage } from './qr-ingreso.page';

describe('QrIngresoPage', () => {
  let component: QrIngresoPage;
  let fixture: ComponentFixture<QrIngresoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QrIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
