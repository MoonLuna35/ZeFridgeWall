import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckCupboardComponent } from './check-cupboard.component';

describe('CheckCupboardComponent', () => {
  let component: CheckCupboardComponent;
  let fixture: ComponentFixture<CheckCupboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckCupboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckCupboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
