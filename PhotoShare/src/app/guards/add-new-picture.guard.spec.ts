import { TestBed, async, inject } from '@angular/core/testing';

import { AddNewPictureGuard } from './add-new-picture.guard';

describe('AddNewPictureGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddNewPictureGuard]
    });
  });

  it('should ...', inject([AddNewPictureGuard], (guard: AddNewPictureGuard) => {
    expect(guard).toBeTruthy();
  }));
});
