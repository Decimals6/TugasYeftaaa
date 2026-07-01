import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JamaahPage } from './jamaah.page';

describe('JamaahPage', () => {
  let component: JamaahPage;
  let fixture: ComponentFixture<JamaahPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JamaahPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
