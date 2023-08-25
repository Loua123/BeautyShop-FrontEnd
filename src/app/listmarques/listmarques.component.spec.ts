import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListmarquesComponent } from './listmarques.component';

describe('ListmarquesComponent', () => {
  let component: ListmarquesComponent;
  let fixture: ComponentFixture<ListmarquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListmarquesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListmarquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
