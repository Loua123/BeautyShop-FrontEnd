import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailscategoryComponent } from './detailscategory.component';

describe('DetailscategoryComponent', () => {
  let component: DetailscategoryComponent;
  let fixture: ComponentFixture<DetailscategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailscategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailscategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
