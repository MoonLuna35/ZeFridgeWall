import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticleWidComponent } from './add-article-wid.component';

describe('AddArticleWidComponent', () => {
  let component: AddArticleWidComponent;
  let fixture: ComponentFixture<AddArticleWidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddArticleWidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArticleWidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
