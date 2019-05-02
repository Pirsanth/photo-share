import { TestBed } from '@angular/core/testing';

import { AuthModalService } from './auth-modal.service';

describe('AuthModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthModalService = TestBed.get(AuthModalService);
    expect(service).toBeTruthy();
  });
});
