import { TestBed } from '@angular/core/testing';

import { ListTypeGenService } from './list-type-gen.service';

describe('ListTypeGenService', () => {
  let service: ListTypeGenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListTypeGenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
