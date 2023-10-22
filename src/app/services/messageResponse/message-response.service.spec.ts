import { TestBed } from '@angular/core/testing';

import { MessageResponseService } from './message-response.service';

describe('MessageResponseService', () => {
  let service: MessageResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
