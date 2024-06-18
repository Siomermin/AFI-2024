import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaMozoPage } from './consulta-mozo.page';

describe('ConsultaMozoPage', () => {
  let component: ConsultaMozoPage;
  let fixture: ComponentFixture<ConsultaMozoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConsultaMozoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
