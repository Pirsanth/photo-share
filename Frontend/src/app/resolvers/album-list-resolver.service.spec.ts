import { TestBed } from '@angular/core/testing';

import { AlbumListResolverService } from './album-list-resolver.service';

describe('AlbumListResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlbumListResolverService = TestBed.get(AlbumListResolverService);
    expect(service).toBeTruthy();
  });
});
