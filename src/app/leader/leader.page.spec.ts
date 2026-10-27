import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderPage } from './leader.page';

describe('LeaderPage', () => {
  let component: LeaderPage;
  let fixture: ComponentFixture<LeaderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
