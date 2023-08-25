import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeVendeursComponent } from './demande-vendeurs.component';

describe('DemandeVendeursComponent', () => {
  let component: DemandeVendeursComponent;
  let fixture: ComponentFixture<DemandeVendeursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeVendeursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeVendeursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
