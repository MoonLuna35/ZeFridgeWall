import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FridgeDoorComponent } from './fridge-door.component';

describe('FridgeDoorComponent', () => {
  let component: FridgeDoorComponent;
  let fixture: ComponentFixture<FridgeDoorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FridgeDoorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FridgeDoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
