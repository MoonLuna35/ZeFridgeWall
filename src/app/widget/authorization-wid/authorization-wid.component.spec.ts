import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationWidComponent } from './authorization-wid.component';

describe('AuthorizationWidComponent', () => {
  let component: AuthorizationWidComponent;
  let fixture: ComponentFixture<AuthorizationWidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizationWidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationWidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
