import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingSearchSelectComponent } from './floating-search-select.component';

describe('FloatingSearchSelectComponent', () => {
  let component: FloatingSearchSelectComponent;
  let fixture: ComponentFixture<FloatingSearchSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingSearchSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingSearchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
