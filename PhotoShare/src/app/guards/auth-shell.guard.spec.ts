import { TestBed, async, inject } from '@angular/core/testing';

import { AuthShellGuard } from './auth-shell.guard';

describe('AuthShellGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthShellGuard]
    });
  });

  it('should ...', inject([AuthShellGuard], (guard: AuthShellGuard) => {
    expect(guard).toBeTruthy();
  }));
});
