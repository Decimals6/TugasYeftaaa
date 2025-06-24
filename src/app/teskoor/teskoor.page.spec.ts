import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeskoorPage } from './teskoor.page';

describe('TeskoorPage', () => {
  let component: TeskoorPage;
  let fixture: ComponentFixture<TeskoorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeskoorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
