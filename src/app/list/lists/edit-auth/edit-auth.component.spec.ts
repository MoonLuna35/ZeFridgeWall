import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuthComponent } from './edit-auth.component';

describe('EditAuthComponent', () => {
  let component: EditAuthComponent;
  let fixture: ComponentFixture<EditAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
