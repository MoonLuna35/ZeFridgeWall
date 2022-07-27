import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EachWeekComponent } from './each-week.component';

describe('EachWeekComponent', () => {
  let component: EachWeekComponent;
  let fixture: ComponentFixture<EachWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EachWeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EachWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
