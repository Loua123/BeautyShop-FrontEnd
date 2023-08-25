import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatVenteComponent } from './stat-vente.component';

describe('StatVenteComponent', () => {
  let component: StatVenteComponent;
  let fixture: ComponentFixture<StatVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatVenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
