import { TestBed } from '@angular/core/testing';

import { AuthHeaderService } from './auth-header.service';

describe('AuthHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthHeaderService = TestBed.get(AuthHeaderService);
    expect(service).toBeTruthy();
  });
});
