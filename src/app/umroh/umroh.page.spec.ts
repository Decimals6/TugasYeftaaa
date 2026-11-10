import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UmrohPage } from './umroh.page';

describe('UmrohPage', () => {
  let component: UmrohPage;
  let fixture: ComponentFixture<UmrohPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UmrohPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
