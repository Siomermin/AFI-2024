import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VincularMesaPage } from './vincular-mesa.page';

describe('VincularMesaPage', () => {
  let component: VincularMesaPage;
  let fixture: ComponentFixture<VincularMesaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VincularMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
