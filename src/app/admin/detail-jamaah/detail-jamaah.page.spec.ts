import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailJamaahPage } from './detail-jamaah.page';

describe('DetailJamaahPage', () => {
  let component: DetailJamaahPage;
  let fixture: ComponentFixture<DetailJamaahPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailJamaahPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
