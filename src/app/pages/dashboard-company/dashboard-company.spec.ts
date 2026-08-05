import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCompany } from './dashboard-company';

describe('DashboardCompany', () => {
  let component: DashboardCompany;
  let fixture: ComponentFixture<DashboardCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCompany],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
