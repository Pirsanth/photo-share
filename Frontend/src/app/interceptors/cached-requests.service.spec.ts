import { TestBed } from '@angular/core/testing';

import { CachedRequestsService } from './cached-requests.service';

describe('CachedRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CachedRequestsService = TestBed.get(CachedRequestsService);
    expect(service).toBeTruthy();
  });
});
