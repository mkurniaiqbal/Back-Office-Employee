import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingSelectComponent } from './floating-select.component';

describe('FloatingSelectComponent', () => {
  let component: FloatingSelectComponent;
  let fixture: ComponentFixture<FloatingSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
