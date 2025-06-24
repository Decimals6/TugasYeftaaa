import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TesrutePage } from './tesrute.page';

describe('TesrutePage', () => {
  let component: TesrutePage;
  let fixture: ComponentFixture<TesrutePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TesrutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
