import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailMinaPage } from './detail-mina.page';

describe('DetailMinaPage', () => {
  let component: DetailMinaPage;
  let fixture: ComponentFixture<DetailMinaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
