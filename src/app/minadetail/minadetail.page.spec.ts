import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinadetailPage } from './minadetail.page';

describe('MinadetailPage', () => {
  let component: MinadetailPage;
  let fixture: ComponentFixture<MinadetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinadetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
