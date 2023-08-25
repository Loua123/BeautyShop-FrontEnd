import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugComponentComponent } from './debug-component.component';

describe('DebugComponentComponent', () => {
  let component: DebugComponentComponent;
  let fixture: ComponentFixture<DebugComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebugComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
