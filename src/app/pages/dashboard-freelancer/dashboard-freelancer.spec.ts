import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFreelancer } from './dashboard-freelancer';

describe('DashboardFreelancer', () => {
  let component: DashboardFreelancer;
  let fixture: ComponentFixture<DashboardFreelancer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFreelancer],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFreelancer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
