import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  token = new BehaviorSubject<string>('')
  getToken = this.token.asObservable();
  constructor() { }
  updateToken(newToken: string) {
    this.token.next(newToken)
  }
}
