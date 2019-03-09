import { TestBed } from '@angular/core/testing';

import { ResendCachedService } from './resend-cached.service';

describe('ResendCachedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResendCachedService = TestBed.get(ResendCachedService);
    expect(service).toBeTruthy();
  });
});
