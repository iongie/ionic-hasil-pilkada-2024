import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, defaultUser } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new BehaviorSubject<User>(defaultUser)
  getUser = this.user.asObservable();
  constructor() { }
  updateUser(newUser: User) {
    this.user.next(newUser)
  }
}
