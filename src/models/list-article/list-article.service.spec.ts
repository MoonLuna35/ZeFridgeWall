import { TestBed } from '@angular/core/testing';

import { ListArticleService } from './list-article.service';

describe('ListArticleService', () => {
  let service: ListArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
