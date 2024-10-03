import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdiomaPopoverPage } from './idioma-popover.page';

describe('IdiomaPopoverPage', () => {
  let component: IdiomaPopoverPage;
  let fixture: ComponentFixture<IdiomaPopoverPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IdiomaPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
