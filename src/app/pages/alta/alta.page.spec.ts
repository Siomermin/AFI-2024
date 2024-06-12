import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaPage } from './alta.page';

describe('AltaPage', () => {
  let component: AltaPage;
  let fixture: ComponentFixture<AltaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AltaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
