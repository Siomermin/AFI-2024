import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrMesaPage } from './qr-mesa.page';

describe('QrMesaPage', () => {
  let component: QrMesaPage;
  let fixture: ComponentFixture<QrMesaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QrMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
