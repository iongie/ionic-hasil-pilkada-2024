import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new BehaviorSubject<User>({
    id: '',
    name: '',
    username: ''
  })
  getUser = this.user.asObservable();
  constructor() { }
  updateUser(newUser: User) {
    this.user.next(newUser)
  }
}
