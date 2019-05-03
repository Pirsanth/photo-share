import { TestBed } from '@angular/core/testing';

import { AddPictureCacheService } from './add-picture-cache.service';

describe('AddPictureCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddPictureCacheService = TestBed.get(AddPictureCacheService);
    expect(service).toBeTruthy();
  });
});
