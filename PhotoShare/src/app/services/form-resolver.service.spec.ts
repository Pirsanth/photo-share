import { TestBed } from '@angular/core/testing';

import { FormResolverService } from './form-resolver.service';

describe('FormResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormResolverService = TestBed.get(FormResolverService);
    expect(service).toBeTruthy();
  });
});
