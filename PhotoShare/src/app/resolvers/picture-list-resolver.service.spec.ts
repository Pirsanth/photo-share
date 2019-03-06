import { TestBed } from '@angular/core/testing';

import { PictureListResolverService } from './picture-list-resolver.service';

describe('PictureListResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PictureListResolverService = TestBed.get(PictureListResolverService);
    expect(service).toBeTruthy();
  });
});
