import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authOperatorGuard } from './auth-operator.guard';

describe('authOperatorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authOperatorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
