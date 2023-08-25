import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitcoderesetpasswordComponent } from './submitcoderesetpassword.component';

describe('SubmitcoderesetpasswordComponent', () => {
  let component: SubmitcoderesetpasswordComponent;
  let fixture: ComponentFixture<SubmitcoderesetpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitcoderesetpasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitcoderesetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
