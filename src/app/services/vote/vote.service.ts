import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Vote, defaultVote } from 'src/app/app.interface';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  VoteState = new BehaviorSubject<Vote[]>([])
  constructor() { }

  getVote = this.VoteState.asObservable()

  updateVote(newState: Vote[]){
    this.VoteState.next(newState)
  }
}
