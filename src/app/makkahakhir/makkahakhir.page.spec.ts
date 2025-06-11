import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MakkahakhirPage } from './makkahakhir.page';

describe('MakkahakhirPage', () => {
  let component: MakkahakhirPage;
  let fixture: ComponentFixture<MakkahakhirPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MakkahakhirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
