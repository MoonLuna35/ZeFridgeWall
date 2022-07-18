import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuseComponent } from './fuse.component';

describe('FuseComponent', () => {
  let component: FuseComponent;
  let fixture: ComponentFixture<FuseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
