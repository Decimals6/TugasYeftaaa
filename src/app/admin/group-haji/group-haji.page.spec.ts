import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupHajiPage } from './group-haji.page';

describe('GroupHajiPage', () => {
  let component: GroupHajiPage;
  let fixture: ComponentFixture<GroupHajiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHajiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
