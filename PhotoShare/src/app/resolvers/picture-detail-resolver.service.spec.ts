import { TestBed } from '@angular/core/testing';

import { PictureDetailResolverService } from './picture-detail-resolver.service';

describe('PictureDetailResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PictureDetailResolverService = TestBed.get(PictureDetailResolverService);
    expect(service).toBeTruthy();
  });
});
