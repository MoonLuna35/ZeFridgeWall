import { TestBed } from '@angular/core/testing';

import { ListCupboardService } from './list-cupboard.service';

describe('ListCupboardService', () => {
  let service: ListCupboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListCupboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
