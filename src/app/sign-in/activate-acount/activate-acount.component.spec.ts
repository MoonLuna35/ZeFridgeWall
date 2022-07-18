import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateAcountComponent } from './activate-acount.component';

describe('ActivateAcountComponent', () => {
  let component: ActivateAcountComponent;
  let fixture: ComponentFixture<ActivateAcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateAcountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateAcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
