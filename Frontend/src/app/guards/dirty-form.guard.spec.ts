import { TestBed, async, inject } from '@angular/core/testing';

import { DirtyFormGuard } from './dirty-form.guard';

describe('DirtyFormGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirtyFormGuard]
    });
  });

  it('should ...', inject([DirtyFormGuard], (guard: DirtyFormGuard) => {
    expect(guard).toBeTruthy();
  }));
});
