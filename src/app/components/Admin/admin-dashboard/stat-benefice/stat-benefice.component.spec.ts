import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatBeneficeComponent } from './stat-benefice.component';

describe('StatBeneficeComponent', () => {
  let component: StatBeneficeComponent;
  let fixture: ComponentFixture<StatBeneficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatBeneficeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatBeneficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
